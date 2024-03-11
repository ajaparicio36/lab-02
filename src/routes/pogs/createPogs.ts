import express, { Express, Request, Response, NextFunction } from "express";
import { Pool } from "pg";

export const createPogs = async (app: Express, connection: Pool) => {
  app.post("/pogs", async (req: Request, res: Response) => {
    const { name, symbol, price, color } = req.body;
    try {
      const createPog = `
                INSERT INTO Pogs(name, ticker_symbol, price, color)
                VALUES ($1, $2, $3, $4)
                `;
      const result = connection.query(createPog, [name, symbol, price, color]);
      res.status(201).json(result);
    } catch (err) {
      console.log(err);
      res.status(422);
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
            throw new Error("Unable to create pogs");
          } else {
            next();
          }
        }
      );
      res.status(200);
    } catch (err) {
      console.log(err);
      res.status(404);
    }
  });
};
