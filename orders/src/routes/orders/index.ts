import express, { Request, Response } from "express";
//@ts-ignore
import { body } from "express-validator";
import { Ticket } from "../../db/TicketsModel";
import { Order } from "../../db/OrdersModel";
import { OrderStatus } from "@sgtickets/common";
import { OrderCreatedEventPublisher } from "../../event/order-created-publisher";
import { OrderCancelPublisher } from "../../event/order-publisher";
import { natsWrapper } from "../../nats-wrapper";

const router = express.Router();

router.post(
  "/add",
  [body("ticketId").not().isEmpty().withMessage("TicketId is required")],
  async (req: Request, res: Response) => {
    const { ticketId } = req.body;

    const ticket = await Ticket.findById(ticketId);

    if (!ticket) {
      throw new Error("Ticket not found");
    }

    const isReserver = await ticket.isReserved();

    if (isReserver) {
      throw new Error("Ticket is already reserved");
    }

    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + 15 * 60);

    console.log(req.currentUser);
    const order = Order.build({
      ticket,
      userId: "123",
      status: OrderStatus.Created,
      expiresAt: expiration,
    });

    console.log(order);
    await order.save();
    await new OrderCreatedEventPublisher(natsWrapper.client).publish({
      id: order.id,
      //@ts-ignore
      status: order.status,
      userId: order.userId,
      expiresAt: order.expiresAt.toISOString(),
      ticket: {
        id: ticket.id,
        price: ticket.price,
      },
    });

    res.status(201).json({
      order,
    });
  }
);
router.get("/all", async (req: Request, res: Response) => {
  const orders = await Order.find({}).populate("ticket");

  console.log(req.currentUser);
  res.status(200).json({
    orders,
  });
});

router.patch("/cancel/:id", async (req: Request, res: Response) => {
  const order = await Order.findById(req.params.id).populate("ticket");

  if (!order) {
    throw new Error("Order not found");
  }

  order.status = OrderStatus.Cancelled;

  await order.save();

  await new OrderCancelPublisher(natsWrapper.client).publish({
    id: order.id,
    version: order.version,
    ticket: {
      id: order.ticket.id,
    },
  });

  res.status(200).json({
    order,
  });
});

router.delete("/delete/:id", async (req: Request, res: Response) => {
  const order = await Order.findByIdAndDelete(req.params.id);

  if (!order) {
    throw new Error("Order not found");
  }

  res.status(200).json({
    order,
  });
});
export default router;
