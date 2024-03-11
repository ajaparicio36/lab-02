import express, { Express, Request, Response } from "express";
import { Pool } from "pg";

export const createPogs = async (app: Express, connection: Pool) => {
  app.post("/pogs", async (req: Request, res: Response) => {
    const { name, ticker_symbol, price, color } = req.body;
    try {
      const createPog = `
                INSERT INTO Pogs(name, ticker_symbol, price, color)
                VALUES ($1, $2, $3, $4)
                `;
      const result = connection.query(createPog, [
        name,
        ticker_symbol,
        price,
        color,
      ]);
      app.use(
        (err: Error, req: Request, res: Response, next: NextFunction): void => {
          if (err) {
            res.status(422).send("Unable to create!");
          } else {
            next();
          }
        }
      );
      res.status(201);
    } catch (err) {
      console.log(err);
      res.status(400);
    }
  });

  app.delete("/pogs/:id", async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const deletePog = `
                  DELETE FROM Pogs
                  WHERE id = $1
                  `;
      const result = connection.query(deletePog, [id]);
      app.use(
        (err: Error, req: Request, res: Response, next: NextFunction): void => {
          if (err) {
            res.status(404).send("Cannot delete!");
          } else {
            next();
          }
        }
      );
      res.status(200);
    } catch (err) {
      console.log(err);
      res.status(400);
    }
  });
};
