import mongoose from "mongoose";

const purchaseSchema = new mongoose.Schema({
  orderNo: { type: Number, autoIncrement: true },
  orderDate: { type: Date, default: Date.now },
  supplier: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Supplier",
    required: true,
  },
  itemTotal: { type: Number },
  discount: { type: Number },
  netAmount: { type: Number },
  items: [
    {
      itemNo: { type: mongoose.Schema.Types.ObjectId, ref: "Item" },
      itemName: { type: String },
      stockUnit: { type: String },
      unitPrice: { type: Number },
      packingUnit: { type: String },
      orderQty: { type: Number },
      itemAmount: { type: Number },
      discount: { type: Number },
      netAmount: { type: Number },
    },
  ],
});

const Purchase = mongoose.model("Purchase", purchaseSchema);

export default Purchase;
