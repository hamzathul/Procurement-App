import mongoose from "mongoose";
import mongooseSequence from "mongoose-sequence";

const purchaseSchema = new mongoose.Schema({
  // orderNo: { type: Number, autoIncrement: true },
  orderDate: { type: Date, default: Date.now },
  supplier: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Supplier",
    required: true,
  },
  items: [
    {
      item: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Item",
        required: true,
      },
      orderQty: { type: Number, required: true },
      packingUnit: { type: String, required: true },
      unitPrice: { type: Number, required: true },
      itemAmount: { type: Number, required: true }, // orderQty * unitPrice
      discount: { type: Number, required: true },
      netAmount: { type: Number, required: true }, // itemAmount - discount
    },
  ],
  itemTotal: { type: Number, required: true }, // Sum of itemAmount for all items
  discountTotal: { type: Number, required: true }, // Sum of discounts for all items
  netAmount: { type: Number, required: true }, // itemTotal - discountTotal
});

purchaseSchema.plugin(mongooseSequence(mongoose), { inc_field: "orderNo" });


const Purchase = mongoose.model("Purchase", purchaseSchema);

export default Purchase;
