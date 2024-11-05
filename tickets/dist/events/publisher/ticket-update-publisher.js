"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TicketUpdatedEvents = void 0;
const common_1 = require("@sgtickets/common");
class TicketUpdatedEvents extends common_1.Publisher {
    constructor() {
        super(...arguments);
        this.subject = common_1.Subjects.TicketUpdated;
    }
}
exports.TicketUpdatedEvents = TicketUpdatedEvents;
