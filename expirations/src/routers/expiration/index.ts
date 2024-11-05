import express from "express";

const router = express.Router();

router.post("/", (req, res) => {
  res.send("Expiration created");
});

export default router;
