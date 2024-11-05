import request from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { app } from "../app";

let mongo: any;

declare global {
  namespace NodeJS {
    interface Global {
      login: () => Promise<string[]>;
      register: () => Promise<string[]>;
    }
  }
}

beforeAll(async () => {
  mongo = new MongoMemoryServer();
  const mongoUri = await mongo.getUri();

  await mongoose.connect(mongoUri);
});

beforeEach(async () => {
  const db = mongoose.connection.db;
  if (!db) {
    throw new Error("Database connection is not established");
  }
  const collections = await db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongoose.connection.close();
});

(global as any).login = async () => {
  const res = await request(app)
    .post("/api/users/register")
    .send({
      email: "test@test",
      password: "password",
    })
    .expect(200);

  const cookie = res.get("Set-Cookie");

  return cookie;
};

(global as any).register = async () => {
  const res = await request(app)
    .post("/api/auth/register")
    .send({
      email: "test@test",
      password: "password",
    })
    .expect(201);

  const cookie = res.get("Set-Cookie");

  return cookie;
};
