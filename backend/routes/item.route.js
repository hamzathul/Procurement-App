import express from "express";
import { createItem, getItems } from "../controllers/item.controller.js";
import upload from "../lib/multerConfig.js";

const router = express.Router();

router.post("/", upload.array("itemImages", 5), createItem);
router.get("/", getItems);

export default router;
