import mongoose from "mongoose";
import mongooseSequence from "mongoose-sequence";

const itemSchema = new mongoose.Schema({
  // itemNo: { type: Number, autoIncrement: true },
  itemName: { type: String, required: true },
  inventoryLocation: { type: String },
  brand: { type: String },
  category: { type: String },
  supplier: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Supplier",
    required: true,
  },
  stockUnit: { type: String },
  unitPrice: { type: Number, required: true },
  itemImages: [{ type: String }],
  status: { type: String, enum: ["Enabled", "Disabled"], default: "Enabled" },
});

itemSchema.plugin(mongooseSequence(mongoose), { inc_field: "itemNo" });


const Item = mongoose.model("Item", itemSchema);

export default Item;
