import express from "express";
import listEndpoints from "express-list-endpoints";
import cors from "cors";
import mongoose from "mongoose";
import {
  badRequestHandler,
  genericErrorHandler,
  notFoundHandler,
} from "./errorHandler.js";
import productsRouter from "./api/products/index.js";
import reviewsRouter from "./api/reviews/index.js";
import cartRouter from "./api/cart/index.js";

const server = express();
const port = process.env.PORT;

server.use(cors());
server.use(express.json());

server.use("/products", productsRouter);
server.use("/reviews", reviewsRouter);
server.use("/cart", cartRouter);

server.use(badRequestHandler);
server.use(notFoundHandler);
server.use(genericErrorHandler);

mongoose.connect(process.env.MONGO_URL);

mongoose.connection.on("connected", () => {
  console.log("Connected to MongoDB");
  server.listen(port, () => {
    console.table(listEndpoints(server));
    console.log(`Server is running on port ${port}`);
  });
});
