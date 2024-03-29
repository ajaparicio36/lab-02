import express, { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import path from "path";
import bodyParser from "body-parser";

import { pool } from "./utils/pool";
import { getPogs } from "./routes/pogs/getPogs";
import { createPogs } from "./routes/pogs/createPogs";
import { editPogs } from "./routes/pogs/editPogs";

export const startServer = async () => {
  dotenv.config();
  const app = express();

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(express.static(path.join(__dirname + "/public")));

  const connection = await pool.connect();
  getPogs(app, pool);
  editPogs(app, pool);
  createPogs(app, pool);
  connection.release();

  return app;
};

const listenToServer = async () => {
  const app = await startServer();
  app.listen(3000, () => {
    console.log("Server started at http://localhost:3000");
  });
};

listenToServer;
