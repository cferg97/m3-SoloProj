import express from "express";
import createHttpError from "http-errors";
import productsModel from "../products/model.js";
import reviewsModel from "./model.js";
import q2m from "query-to-mongo";

const reviewsRouter = express.Router();

reviewsRouter.post("/:productid", async (req, res, next) => {
  try {
    const newReview = new reviewsModel({
      ...req.body,
      productId: req.params.productid,
    });
    const { _id } = await newReview.save();
    await productsModel.findByIdAndUpdate(
      req.params.productid,
      { $push: { reviews: _id } },
      { new: true }
    );
    res.status(201).send({ _id });
  } catch (err) {
    next(err);
  }
});

export default reviewsRouter;
