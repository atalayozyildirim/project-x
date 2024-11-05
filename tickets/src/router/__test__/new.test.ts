import request from "supertest";

import { app } from "../../app";

it("returns a 201 on successful ticket creation", async () => {
  return request(app).post("/api/tickets").expect(200);
});
