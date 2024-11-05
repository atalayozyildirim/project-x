"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ticket_update_publisher_1 = require("../../events/publisher/ticket-update-publisher");
const express_1 = __importDefault(require("express"));
// @ts-ignore
const express_validator_1 = require("express-validator");
const tickets_1 = require("../../db/tickets");
const ticket_create_publisher_1 = require("../../events/publisher/ticket-create-publisher");
const nats_wrapper_1 = require("../../nats-wrapper");
const router = express_1.default.Router();
router.get("/tickets", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield tickets_1.Ticket.find({});
    res.status(200).json({
        data,
    });
}));
router.post("/tickets", [
    (0, express_validator_1.body)("title").not().isEmpty().withMessage("Title is required"),
    (0, express_validator_1.body)("price")
        .isFloat({ gt: 0 })
        .withMessage("Price must be greater than 0"),
], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, price } = req.body;
    const ticket = tickets_1.Ticket.build({
        title,
        price,
        userId: "123",
        version: 0,
    });
    yield ticket.save();
    yield new ticket_create_publisher_1.TicketCreatedPublisher(nats_wrapper_1.natsWrapper.client).publish({
        id: ticket.id,
        title: ticket.title,
        price: ticket.price,
        userId: ticket.userId,
        version: 1,
    });
    res.status(201).json({
        data: ticket,
    });
}));
router.get("/tickets/:id", [(0, express_validator_1.body)("id").not().isEmpty().withMessage("Id is required")], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const ticket = yield tickets_1.Ticket.findById(req.params.id);
    if (!ticket) {
        throw new Error("Ticket not found");
    }
    res.status(200).json({
        data: ticket,
    });
}));
router.put("/tickets/:id", [
    (0, express_validator_1.body)("title").not().isEmpty().withMessage("Title is required"),
    (0, express_validator_1.body)("price")
        .isFloat({ gt: 0 })
        .withMessage("Price must be greater than 0"),
], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const ticket = yield tickets_1.Ticket.findById(req.params.id);
    if (!ticket) {
        throw new Error("Ticket not found");
    }
    if (req.body.title) {
        ticket.set({
            title: req.body.title,
        });
    }
    else if (req.body.price) {
        ticket.set({
            price: req.body.price,
        });
    }
    ticket.set({
        title: req.body.title,
        price: req.body.price,
    });
    yield ticket.save();
    yield new ticket_update_publisher_1.TicketUpdatedEvents(nats_wrapper_1.natsWrapper.client).publish({
        id: ticket.id,
        title: ticket.title,
        price: ticket.price,
        userId: ticket.userId,
        version: ticket.version,
    });
    res.status(200).json({
        data: ticket,
    });
}));
exports.default = router;
