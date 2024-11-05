import express from "express";
import index from "./orders/index";
const router = express.Router();

// @ts-ignore
router.use("/orders", index);

export default router;
