import request from "supertest";
import { app } from "../../app";

it("return a 201 on successful signup", async () => {
  return request(app)
    .post("/api/users/register")
    .send({
      email: "test@test",
      password: "password",
    })
    .expect(201);
});
