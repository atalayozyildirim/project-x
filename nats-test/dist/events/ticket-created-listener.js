"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TicketCreatedListener = void 0;
const base_listener_1 = require("./base-listener");
const subject_1 = require("./subject");
class TicketCreatedListener extends base_listener_1.Listener {
    constructor() {
        super(...arguments);
        this.subject = subject_1.Subject.TicketCreated;
        this.queueGroupName = "payments-service";
    }
    onMessage(data, msg) {
        console.log("Event data!", data);
        msg.ack();
    }
}
exports.TicketCreatedListener = TicketCreatedListener;
