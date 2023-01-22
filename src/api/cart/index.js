import express from "express";
import cartModel from "./model.js";
import createHttpError from "http-errors";

const cartRouter = express.Router();

cartRouter.get("/", async (req, res, next) => {
  try {
    const carts = await cartModel.find();
    res.send(carts);
  } catch (err) {
    next(err);
  }
});

cartRouter.get("/:cartid", async (req, res, next) => {
  try {
    const cart = await cartModel.findById(req.params.cartid).populate({
      path: "products",
      select: "name brand price",
    });
    if (cart) {
      res.send(cart);
    } else {
      next(
        createHttpError(404, `Cart with ID ${req.params.cartid} not found.`)
      );
    }
  } catch (err) {
    next(err);
  }
});

cartRouter.post("/", async (req, res, next) => {
  try {
    const newCart = new cartModel(req.body);
    if (newCart) {
      const { _id } = await newCart.save();
      res.send({ _id });
    }
  } catch (err) {
    next(err);
  }
});

cartRouter.put("/:cartid/:productid", async (req, res, next) => {
  try {
    const addToCart = await cartModel.findByIdAndUpdate(
      req.params.cartid,
      { $push: { products: { _id: req.params.productid } } },
      { new: true, runValidators: true }
    );
    if (addToCart) {
      res.send(addToCart);
    } else {
      next(createHttpError(404, `Cart with ID ${req.params.cartid} not found`));
    }
  } catch (err) {
    next(err);
  }
});

export default cartRouter;
