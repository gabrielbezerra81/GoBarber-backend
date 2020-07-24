import "reflect-metadata";
import express from "express";
import "express-async-errors";
import cors from "cors";

import routes from "./routes";
import uploadConfig from "@config/upload";

import "@shared/infra/typeorm";
import errorHandler from "@shared/infra/http/middlewares/errorHandler";

const app = express();

app.use(cors());

app.use(express.json());

app.use("/files", express.static(uploadConfig.directory));

app.use("/", routes);

app.use(errorHandler);

app.listen(3333, () => {
  console.log("server started on port 3333");
});
