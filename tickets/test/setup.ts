import request from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { beforeAll, beforeEach, afterAll } from "@jest/globals";
import { app } from "../src/app"; // Ensure this path is correct and the module exists

let mongo: any;

declare global {
  namespace NodeJS {
    interface Global {
      login: () => Promise<string[]>;
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
  const payload = {
    email: "test@test",
    password: "password",
  };

  const token = jwt.sign(payload, process.env.JWT_KEY!);

  const sessionJson = JSON.stringify({ jwt: token });

  const base64 = Buffer.from(sessionJson).toString("base64");

  return [`express:sess=${base64}`];
};

(global as any).register = async () => {
  const email = "test@test";
  const password = "password";

  const res = await request(app)
    .post("api/auth/register")
    .send({ email, password })
    .expect(200);

  const cookie = res.get("Set-Cookie");

  return cookie;
};
