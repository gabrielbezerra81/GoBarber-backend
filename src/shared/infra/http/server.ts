import "reflect-metadata";
import "dotenv/config";
import express from "express";
import "express-async-errors";
import cors from "cors";
import { errors } from "celebrate";

import routes from "./routes";

import uploadConfig from "@config/upload";

import "@shared/infra/typeorm";

import errorHandler from "@shared/infra/http/middlewares/errorHandler";

import "@shared/container/container";
import rateLimiter from "./middlewares/rateLimiter";

const app = express();

app.use(cors());

app.use(express.json());

app.use("/files", express.static(uploadConfig.uploadsFolder));

app.use(rateLimiter);

app.use("/", routes);

app.use(errors());

app.use(errorHandler);

app.listen(3333, () => {
  console.log("server started on port 3333");
});
