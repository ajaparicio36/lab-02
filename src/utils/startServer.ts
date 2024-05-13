import express from "express";
import bodyParser from "body-parser";
import { routes } from "../routes/pogs/pogs";

export const startServer = () => {
  const app = express();
  app.use(bodyParser.json());
  routes(app);

  return app;
};
