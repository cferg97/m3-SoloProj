import express from "express";
import createHttpError from "http-errors";
import productsModel from "./model.js";
import q2m from "query-to-mongo";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary } from "cloudinary";

const productsRouter = express.Router();

const cloudinaryUpload = multer({
  storage: new CloudinaryStorage({
    cloudinary,
    params: {
      folder: "products",
    },
  }),
}).single("imageUrl");

productsRouter.get("/", async (req, res, next) => {
  try {
    const mongoQuery = q2m(req.query);
    const { total, products } = await productsModel.paginatation(mongoQuery);
    res.send({
      links: mongoQuery.links("http://localhost:3001/products", total),
      total,
      totalPages: Math.ceil(total / mongoQuery.options.limit),
      products,
    });
  } catch (err) {
    next(err);
  }
});

productsRouter.post("/", cloudinaryUpload, async (req, res, next) => {
  try {
    const newProduct = await new productsModel({
      ...req.body,
      imageUrl: req.file.path,
    });
    const { _id } = await newProduct.save();
    res.status(201).send({ _id });
  } catch (err) {
    next(err);
  }
});

productsRouter.get("/:productid", async (req, res, next) => {
  try {
    const product = await productsModel.findById(req.params.productid);
    if (product) {
      res.send(product);
    } else {
      next(
        createHttpError(
          404,
          `Product with ID ${req.params.productid} not found.`
        )
      );
    }
  } catch (err) {
    next(err);
  }
});

productsRouter.put("/:productid", async (req, res, next) => {
  try {
    const updatedProduct = await productsModel.findByIdAndUpdate(
      req.params.productid,
      req.body,
      { new: true, runValidators: true }
    );
    if (updatedProduct) {
      res.send(updatedProduct);
    } else {
      next(
        createHttpError(
          404,
          `Product with ID ${req.params.productid} not found.`
        )
      );
    }
  } catch (err) {
    next(err);
  }
});

productsRouter.delete("/:productid", async (req, res, next) => {
  try {
    const deletedProduct = await productsModel.findByIdAndDelete(
      req.params.productid
    );
    if (deletedProduct) {
      res.status(204).send();
    } else {
      next(
        createHttpError(
          404,
          `Product with ID ${req.params.productid} not found.`
        )
      );
    }
  } catch (err) {
    next(err);
  }
});

export default productsRouter;
