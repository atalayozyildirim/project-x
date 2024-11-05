import request from "supertest";
import { app } from "../../app";

it("get all tickets", async () => {
  const response = await request(app)
    .get("/api/tickets")
    // @ts-ignore
    .cookies(await global.signin())
    .send()
    .expect(200);
});
