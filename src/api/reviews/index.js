import express from "express";
import createHttpError from "http-errors";
import productsModel from "../products/model.js";
import reviewsModel from "./model.js";
import q2m from "query-to-mongo";

const reviewsRouter = express.Router();

reviewsRouter.get("/", async (req, res, next) => {
  try {
    const reviews = await reviewsModel.find();
    res.send(reviews);
  } catch (err) {
    next(err);
  }
});

reviewsRouter.get("/products/:productid", async (req, res, next) => {
  try {
    const review = await reviewsModel.find({ productId: req.params.productid });
    if (review) {
      res.send(review);
    } else {
      next(
        createHttpError(
          404,
          `Reviews not found for product with id ${req.params.productid}`
        )
      );
    }
  } catch (err) {
    next(err);
  }
});

reviewsRouter.get("/:reviewid", async (req, res, next) => {
  try {
    const review = await reviewsModel.findById(req.params.reviewid);
    if (review) {
      res.send(review);
    } else {
      next(
        createHttpError(404, `Review with ID ${req.params.reviewid} not found.`)
      );
    }
  } catch (err) {
    next(err);
  }
});

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

reviewsRouter.put("/:reviewid", async (req, res, next) => {
  try {
    const updatedReview = await reviewsModel.findByIdAndUpdate(
      req.params.reviewid,
      req.body,
      { new: true, runValidators: true }
    );
    if (updatedReview) {
      res.send(updatedReview);
    } else {
      createHttpError(404, `Review with ID ${req.params.reviewid} not found.`);
    }
  } catch (err) {
    next(err);
  }
});

reviewsRouter.delete("/:reviewid", async (req, res, next) => {
  try {
    const selectedReview = await reviewsModel.findById(req.params.reviewid);
    const productId = selectedReview.productId.toString();
    const deletedReview = await reviewsModel.findByIdAndDelete(
      req.params.reviewid
    );
    if (deletedReview) {
      await productsModel.findByIdAndUpdate(productId, {
        $pull: { reviews: req.params.reviewid },
      });
      res.status(204).send();
    } else {
      next(
        createHttpError(404, `Review with id ${req.params.reviewid} not found`)
      );
    }
  } catch (err) {
    next(err);
  }
});

export default reviewsRouter;
