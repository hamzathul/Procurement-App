import Purchase from "../models/purchase.model.js";

export const createPurchaseOrder = async (req, res) => {
  try {
    const purchaseOrder = new Purchase(req.body);
    await purchaseOrder.save();
    res.status(201).json(purchaseOrder);
  } catch (error) {
    console.log("Error in createPurchaseOrder controller:", error.message);
    res.status(400).json({ error: error.message });
  }
};

export const getPurchaseOrders = async (req, res) => {
  try {
    const purchaseOrders = await Purchase.find().populate(
      "supplier items.itemNo"
    );
    res.json(purchaseOrders);
  } catch (error) {
    console.log("Error in getPurchaseOrders controller:", error.message);
    res.status(400).json({ error: error.message });
  }
};
