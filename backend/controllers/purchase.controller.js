import Item from "../models/item.model.js";
import Purchase from "../models/purchase.model.js";

export const createPurchaseOrder = async (req, res) => {
  try {
    const { supplier, items } = req.body;

    let itemTotal = 0;
    let discountTotal = 0;

    // Calculate itemTotal, discountTotal, and netAmount
    const updatedItems = await Promise.all(
      items.map(async (itemData) => {
        const item = await Item.findById(itemData.item);
        const itemAmount = itemData.orderQty * item.unitPrice;
        const discount = itemData.discount || 0;
        const netAmount = itemAmount - discount;

        itemTotal += itemAmount;
        discountTotal += discount;

        return {
          ...itemData,
          unitPrice: item.unitPrice,
          itemAmount,
          netAmount,
        };
      })
    );

    const netAmount = itemTotal - discountTotal;

    const purchaseOrder = new Purchase({
      orderNo: Date.now(),
      supplier,
      items: updatedItems,
      itemTotal,
      discountTotal,
      netAmount,
    });

    await purchaseOrder.save();
    res.status(201).json(purchaseOrder);
  } catch (error) {
    console.log("Error in createPurchaseOrder controller:", error.message);
    res.status(400).json({ error: error.message });
  }
};

export const getPurchaseOrders = async (req, res) => {
  try {
    const purchaseOrders = await PurchaseOrder.find()
      .populate("supplier")
      .populate("items.item");
    res.json(purchaseOrders);
  } catch (error) {
    console.log("Error in getPurchaseOrders controller:", error.message);
    res.status(400).json({ error: error.message });
  }
};
