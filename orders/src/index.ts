import express from "express";
import { createConnectionDb } from "./config/createConnectionDb";
import router from "./routes/index";
import { natsWrapper } from "./nats-wrapper";
import { TicketCreatedListener } from "./event/listener/ticket-created-listener";
import { TicketUpdateListener } from "./event/listener/ticket-update-listener";
import { currentUser } from "./middleware/CurrentUser";
import { PaymentCreatedListener } from "./event/listener/payment-created-listener";
import { ExpirationCompleteListener } from "./event/listener/expiration-listener";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//@ts-ignore
app.use("/api", currentUser, router);

app.listen(3000, async () => {
  try {
    await createConnectionDb();
    await natsWrapper.connect("ticketing", "orders", process.env.NATS_URL!);

    natsWrapper.client.on("close", () => {
      console.log("NATS connection closed!");
      process.exit();
    });

    process.on("SIGINT", () => natsWrapper.client.close());
    process.on("SIGTERM", () => natsWrapper.client.close());

    console.log("Connected to Orders");

    await new TicketCreatedListener(natsWrapper.client).listen();
    await new ExpirationCompleteListener(natsWrapper.client).listen();
    await new TicketUpdateListener(natsWrapper.client).listen();
    await new PaymentCreatedListener(natsWrapper.client).listen();

    console.log("Orders service is running on port 3000");
  } catch (error) {
    console.log(error);
  }
});
