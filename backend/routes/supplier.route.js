import express from "express";
import { createSupplier, getSuppliers } from "../controllers/supplier.controller.js";

const router = express.Router();

router.post("/", createSupplier);
router.get("/", getSuppliers);

export default router;
