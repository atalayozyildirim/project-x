import { TicketUpdatedEvents } from "../../events/publisher/ticket-update-publisher";
import express, { Request, Response } from "express";
// @ts-ignore
import { body } from "express-validator";
import { Ticket } from "../../db/tickets";
import { TicketCreatedPublisher } from "../../events/publisher/ticket-create-publisher";
import { natsWrapper } from "../../nats-wrapper";

const router = express.Router();

router.get("/tickets", async (req, res) => {
  const data = await Ticket.find({});

  res.status(200).json({
    data,
  });
});

router.post(
  "/tickets",
  [
    body("title").not().isEmpty().withMessage("Title is required"),
    body("price")
      .isFloat({ gt: 0 })
      .withMessage("Price must be greater than 0"),
  ],
  async (req: Request, res: Response) => {
    const { title, price } = req.body;

    const ticket = Ticket.build({
      title,
      price,
      userId: "123",
      version: 0,
    });

    await ticket.save();

    await new TicketCreatedPublisher(natsWrapper.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      version: 1,
    });
    res.status(201).json({
      data: ticket,
    });
  }
);
router.get(
  "/tickets/:id",
  [body("id").not().isEmpty().withMessage("Id is required")],
  async (req: Request, res: Response) => {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      throw new Error("Ticket not found");
    }

    res.status(200).json({
      data: ticket,
    });
  }
);

router.put(
  "/tickets/:id",
  [
    body("title").not().isEmpty().withMessage("Title is required"),
    body("price")
      .isFloat({ gt: 0 })
      .withMessage("Price must be greater than 0"),
  ],
  async (req: Request, res: Response) => {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      throw new Error("Ticket not found");
    }

    if (req.body.title) {
      ticket.set({
        title: req.body.title,
      });
    } else if (req.body.price) {
      ticket.set({
        price: req.body.price,
      });
    }
    ticket.set({
      title: req.body.title,
      price: req.body.price,
    });

    await ticket.save();
    await new TicketUpdatedEvents(natsWrapper.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      version: ticket.version,
    });

    res.status(200).json({
      data: ticket,
    });
  }
);

export default router;
