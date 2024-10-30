import mongoose from "mongoose";
import mongooseSequence from 'mongoose-sequence'

const supplierSchema = new mongoose.Schema({
  // supplierNo: { type: Number, autoIncrement: true },
  supplierName: { type: String, required: true },
  address: { type: String },
  taxNo: { type: String },
  country: { type: String, required: true },
  mobileNo: { type: String },
  email: { type: String, unique: true, required: true },
  status: {
    type: String,
    enum: ["Active", "Inactive", "Blocked"],
    default: "Active",
  },
});

supplierSchema.plugin(mongooseSequence(mongoose), { inc_field: "supplierNo" });

const Supplier = mongoose.model("Supplier", supplierSchema);

export default Supplier;
