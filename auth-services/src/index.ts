import express from "express";
import router from "./routes/index";
import createDatabase from "./config/setDB";
import cookieSession from "cookie-session";
import { currentUser } from "./middleware/CurrentUser";
createDatabase();

const app = express();

app.set("trust proxy", true);
app.use(
  cookieSession({
    signed: false,
    secure: false,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//@ts-ignore
app.use("/api", currentUser, router);

app.use("*", (req, res) => {
  res.status(404).send("Page not found");
});

app.listen(3000, () => {
  if (!process.env.MONGO_URI) {
    console.error("MONGO_URI is not defined");
    process.exit(1);
  }
  console.log("Server is running on port 3000");
});
