import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { User } from "../../db/model/User";
// @ts-ignore
import { body } from "express-validator";
import bcrypt from "bcryptjs";
import { currentUser } from "../../middleware/CurrentUser";
import { DataBaseConnectionError } from "../../erorrs/DataBaseConnectionError";
import { Session } from "express-session";

const router = express.Router();

router.get("/", (_req: Request, res: Response) => {
  res.json({
    message: "Auth service running",
  });
});
// register router
router.post(
  "/register",
  [
    body("email").isEmail().withMessage("Email is invalid"),
    body("password")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("Password must be between 4 and 20 characters"),
  ],
  async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      const existing = await User.findOne({ email });

      if (existing) throw new Error("User already exists");

      const user = new User({
        email,
        password,
      });

      await user.save();

      res.status(201).send("User created successfully");
    } catch (error) {
      res.status(400).send("Internal server error " + error);
    }
  }
);

// login rotuer
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Email is invalid"),
    body("password")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("Password must be between 4 and 20 characters"),
  ],
  async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      const existingUser = await User.findOne({ email });
      if (!existingUser) throw new Error("Invalid credentials");

      const isPassowrdValid = await bcrypt.compare(
        password,
        existingUser.password
      );
      if (!isPassowrdValid) throw new Error("Invalid credentials");

      const _token = jwt.sign(
        {
          id: existingUser._id,
          email: existingUser.email,
        },
        process.env.JWT_KEY!
      );

      (req.session as Session & { jwt: string }).jwt = _token;
      console.log(req.session);
      res.status(200).json({
        message: "User logged in successfully",
      });
    } catch (error) {
      res.status(400).send("Internal server error " + error);
    }
  }
);
router.get("/logout", (_req: Request, _res: Response) => {
  throw new DataBaseConnectionError();
});

export default router;
