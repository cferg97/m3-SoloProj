import mongoose from "mongoose";

const { Schema, model } = mongoose;

const reviewSchema = new Schema(
  {
    comment: { type: String, required: true },
    rate: { type: Number, min: 1, max: 5, required: true },
    productId: { type: String, required: true },
  },
  { timestamps: true }
);

export default model("Reviews", reviewSchema);
