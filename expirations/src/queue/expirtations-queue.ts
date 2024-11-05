import { natsWrapper } from "../nats-wrapper";
import Bull from "bull";
import { ExpirationCompletePublisher } from "./../events/publisher/expiration-complete-publisher";

export interface Payload {
  orderId: string;
}

const expirtationsQueue = new Bull<Payload>("order:expiration", {
  redis: {
    host: process.env.REDIS_URL,
  },
});

expirtationsQueue.process(async (job) => {
  console.log(
    "I want to publish an expiration:complete event for orderId",
    job.data.orderId
  );
  new ExpirationCompletePublisher(natsWrapper.client).publish({
    orderId: job.data.orderId,
  });
});

export { expirtationsQueue };
