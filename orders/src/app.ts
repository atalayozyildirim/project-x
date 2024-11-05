import express from "express";
import { createConnectionDb } from "./config/createConnectionDb";
import router from "./routes/index";
import { requireAuth } from "@sgtickets/common";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);

app.listen(3000, async () => {
  try {
    await createConnectionDb();
    console.log("Orders service is running on port 3000");
  } catch (error) {
    console.log(error);
  }
});
export { app };
