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
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderCancellListener = void 0;
const common_1 = require("@sgtickets/common");
const queue_group_1 = require("./queue-group");
const ticket_update_publisher_1 = require("../publisher/ticket-update-publisher");
const tickets_1 = require("../../db/tickets");
class OrderCancellListener extends common_1.Listener {
    constructor() {
        super(...arguments);
        this.subject = common_1.Subjects.OrderCancelled;
        this.queueGroupName = queue_group_1.queueGroupName;
    }
    onMessage(data, msg) {
        return __awaiter(this, void 0, void 0, function* () {
            const ticket = yield tickets_1.Ticket.findById(data.ticket.id);
            if (!ticket) {
                throw new Error("Ticket not found");
            }
            ticket.set({ orderId: common_1.Subjects.OrderCancelled });
            yield ticket.save();
            // publish an event that ticket has been updated
            yield new ticket_update_publisher_1.TicketUpdatedEvents(this.client).publish({
                id: ticket.id,
                title: ticket.title,
                price: ticket.price,
                userId: ticket.userId,
                orderId: ticket.orderId,
                version: ticket.version,
            });
            msg.ack();
        });
    }
}
exports.OrderCancellListener = OrderCancellListener;
