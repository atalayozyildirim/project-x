import request from "supertest";
import { app } from "../../app";

it("responds with details about the current user", async () => {
  const login = await request(app).post("/api/users/register").send({
    email: "test@test.com",
    password: "password",
  });

  const cookie = login.get("Set-Cookie");

  const respone = await request(app)
    .get("/api/users/currentuser")
    .set("Cookie", cookie || [])
    .send()
    .expect(200);

  expect(respone.body.currentUser.email).toEqual("test@test.com");
});
