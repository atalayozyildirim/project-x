import express from "express";
import routers from "./tickets/index";
import { AuthController } from "../middleware/authController";

const router = express.Router();
//@ts-ignore
router.use("/api", AuthController, routers);

export default router;
