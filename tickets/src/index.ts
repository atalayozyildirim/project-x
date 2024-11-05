import express, { Request, Response } from "express";
import cookieSession from "cookie-session";
import { connectDatabase } from "./config/ConnectDatabase";
import router from "./router";
import { natsWrapper } from "./nats-wrapper";

const app = express();

app.set("trust proxy", true);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "test",
  })
);

app.use("/", router);
app.use("*", (req: Request, res: Response) => {
  res.send("404 Not Found");
});

app.listen(3000, async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI must be defined");
    }
    console.log("Server running on port 3000");
    await natsWrapper.connect(
      "ticketing",
      "ticketing-client",
      process.env.NATS_URL!
    );
    natsWrapper.client.on("close", () => {
      console.log("NATS connection closed");
      process.exit();
    });

    process.on("SIGINT", () => natsWrapper.client.close());
    process.on("SIGTERM", () => natsWrapper.client.close());

    await connectDatabase();
  } catch (error) {
    console.log("Error connecting to database", error);
  }
});
