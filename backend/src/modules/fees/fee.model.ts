import { Schema, model } from "mongoose";

const feeStructureSchema = new Schema(
  {
    classId: { type: Schema.Types.ObjectId, ref: "Class", required: true },
    academicYear: { type: String, required: true },
    components: [
      {
        name: { type: String, required: true },
        amount: { type: Number, required: true },
        dueDate: { type: Date, required: true },
      },
    ],
  },
  { timestamps: true },
);

const feeInvoiceSchema = new Schema(
  {
    studentId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    academicYear: { type: String, required: true },
    month: { type: String, required: true },
    components: [
      {
        name: { type: String, required: true },
        amount: { type: Number, required: true },
        paid: { type: Boolean, default: false },
        paidAt: { type: Date },
        transactionId: { type: String },
      },
    ],
    totalAmount: { type: Number, required: true },
    amountPaid: { type: Number, required: true, default: 0 },
    status: { type: String, enum: ["pending", "partial", "paid", "overdue"], required: true },
    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String },
  },
  { timestamps: true },
);

feeStructureSchema.index({ classId: 1, academicYear: 1 }, { unique: true });
feeInvoiceSchema.index({ studentId: 1, academicYear: 1, month: 1 }, { unique: true });

export const FeeStructureModel = model("FeeStructure", feeStructureSchema);
export const FeeInvoiceModel = model("FeeInvoice", feeInvoiceSchema);

