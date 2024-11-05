"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TicketCreatedPublisher = void 0;
const base_publisher_1 = require("./base-publisher");
const subject_1 = require("./subject");
class TicketCreatedPublisher extends base_publisher_1.Publisher {
    constructor() {
        super(...arguments);
        this.subject = subject_1.Subject.TicketCreated;
    }
}
exports.TicketCreatedPublisher = TicketCreatedPublisher;
