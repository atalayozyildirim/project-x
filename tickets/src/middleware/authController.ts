import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

const AuthController = (req: Request, res: Response, next: NextFunction) => {
  try {
    // @ts-ignore
    const verify = jwt.verify(req.session.jwt, process.env.JWT_KEY!);

    if (verify) {
      req.body.user = verify;

      return next();
    }
  } catch (ex) {
    res.status(401).json({ message: "Unauthorized" });
  }
};

export { AuthController };
