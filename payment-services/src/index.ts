import express from "express";
import router from "./routes";
import { natsWrapper } from "./natsWrapper";
import { OrderCreatedListener } from "./event/listener/Order-Created-listener";
import { OrderCancelledEvents } from "./event/listener/Order-cancelled-listener";

import { connectDatabase } from "./config/connectDB";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);

app.listen(3000, async () => {
  try {
    if (!process.env.NATS_CLUSTER_ID) {
      throw new Error("NATS_CLUSTER_ID must be defined");
    }
    if (!process.env.NATS_CLIENT_ID) {
      throw new Error("NATS_CLIENT_ID must be defined");
    }
    if (!process.env.NATS_URL) {
      throw new Error("NATS_URL must be defined");
    }
    connectDatabase();

    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL
    );

    process.on("SIGINT", () => natsWrapper.client.close());
    process.on("SIGTERM", () => natsWrapper.client.close());

    await new OrderCreatedListener(natsWrapper.client).listen();
    await new OrderCancelledEvents(natsWrapper.client).listen();

    console.log("Server is running on port 3000");
  } catch (error) {
    console.log("Error: ", error);
  }
});
