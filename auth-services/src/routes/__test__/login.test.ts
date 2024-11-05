import request from "supertest";
import { app } from "../../app";

it("user login with valid email and password", async () => {
  await request(app)
    .post("/api/users/register")
    .send({
      email: "test@test",
      password: "password",
    })
    .expect(200);
});
