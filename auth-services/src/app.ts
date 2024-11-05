import express from "express";
import router from "./routes/index";
import createDatabase from "./config/setDB";
import session from "express-session";

createDatabase();

const app = express();

if (!process.env.jwt) {
  console.error("JWT secret is not defined");
  process.env.jwt = "asdf";
  // process.exit(1);
}

app.set("trust proxy", true);
app.use(
  session({
    secret: process.env.jwt!,
    resave: false, // Add resave option
    saveUninitialized: false, // Add saveUninitialized option
    cookie: { secure: true },
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api", router);

app.use("*", (req, res) => {
  res.status(404).send("Page not found");
});

export { app };
