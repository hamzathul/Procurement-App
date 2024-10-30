import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import { connectDB } from "./lib/db.js";
import purchaseRoutes from "./routes/purchase.route.js";
import supplierRoutes from "./routes/supplier.route.js";
import itemRoutes from "./routes/item.route.js";

dotenv.config();

const app = express();

const corsURI = "http://localhost:5173";
app.use(cors({ origin: corsURI, credentials: true }));

app.use(express.json());

const PORT = process.env.PORT || 5000;

app.use("/purchase-orders", purchaseRoutes);
app.use("/suppliers", supplierRoutes);
app.use("/items", itemRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on PORT : ${PORT}`);
  connectDB();
});
