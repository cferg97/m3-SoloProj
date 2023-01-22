import mongoose from "mongoose";

const { Schema, model } = mongoose;

const cartSchema = new Schema({
  products: [{ type: Schema.Types.ObjectId, required: true, ref: "Products" }],
});

export default model("Cart", cartSchema);
