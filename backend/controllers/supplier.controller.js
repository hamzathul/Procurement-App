import Supplier from "../models/supplier.model.js";

export const createSupplier = async (req, res) => {
  try {
    const supplier = new Supplier(req.body);
    await supplier.save();
    res.status(201).json(supplier);
  } catch (error) {
    console.log("Error in createSupplier controller:", error.message);
    res.status(400).json({ error: error.message });
  }
};

export const getSuppliers = async (req, res) => {
  try {
    const status = req.query.status || "Active";
    const suppliers = await Supplier.find({ status });
    res.json(suppliers);
  } catch (error) {
    console.log("Error in getSuppliers controller:", error.message);
    res.status(400).json({ error: error.message });
  }
};
