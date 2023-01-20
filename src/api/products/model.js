import mongoose from "mongoose";

const { Schema, model } = mongoose;

const productSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    brand: { type: String, required: true },
    imageUrl: { type: String, required: true },
    price: { type: Number, reqiured: true },
    category: { type: String, required: true },
    reviews: [{ type: Schema.Types.ObjectId, ref: "Reviews" }],
  },
  { timestamps: true }
);

productSchema.static("paginatation", async function (query) {
  const total = await this.countDocuments(query.criteria);

  const products = await this.find(query.criteria, query.options.fields)
    .skip(query.options.skip)
    .limit(query.options.limit)
    .sort(query.options.sort)
    .populate({
      path: "reviews",
      select: "comment rate",
    });

  return { total, products };
});

export default model("Products", productSchema);
