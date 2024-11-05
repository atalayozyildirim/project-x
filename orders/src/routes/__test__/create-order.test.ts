import request from "supertest";
import { app } from "../../app";

it("create a order", async () => {
  // const user = global.register();
  // const login = global.login();
  const response = await request(app)
    .post("/api/orders")
    .set("Cookie", "a")
    .send({
      ticketId: "123",
    })
    .expect(201);
});
