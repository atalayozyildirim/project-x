import { natsWrapper } from "../../natsWrapper";
import express, { Request, Response } from "express";
import { stripe } from "../../stripe";
// @ts-ignore
import { body } from "express-validator";
import { validateRequest, OrderStatus } from "@sgtickets/common";
import { PaymentCreatedPublisher } from "../../event/publisher/Payment-Created-Publisher";
import { Order } from "../../model/Order";
import { Payment } from "../../model/Payment";

const router = express.Router();

router.get("/", (req, res) => {
  res.send("Hello from payment service");
});

router.post(
  "/",
  [body("token").not().isEmpty(), body("orderId").not().isEmpty()],
  validateRequest,
  async (req: Request, res: Response) => {
    const { token, orderId } = req.body;

    const order = await Order.findById(orderId);

    console.log(order);
    if (!order) {
      throw new Error("Order not found");
    }
    if (order.userId !== req.currentUser!.id) {
      throw new Error("Unauthorized");
    }
    if (order.status === OrderStatus.Cancelled) {
      throw new Error("Order is cancelled");
    }

    const payment = await stripe.charges.create({
      currency: "usd",
      amount: order.price * 100,
      source: token,
    });

    const paymentData = await Payment.build({
      orderId: order.id,
      stripeId: payment.id,
    });

    await new PaymentCreatedPublisher(natsWrapper.client).publish({
      id: paymentData.id,
      orderId: paymentData.orderId,
      stripeId: paymentData.stripeId,
    });

    res.status(200).send({ paymentId: paymentData.id });
  }
);

export default router;
