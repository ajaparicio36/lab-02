import express, { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import { Pool } from "pg";
import path from "path";

const startServer = () => {
  dotenv.config();
  const app = express();
  const pool = new Pool({
    connectionString: `${process.env.DATABASE_URL}`,
  });

  app.use("user" + express.static(path.join(__dirname + "/public")));

  app
    .get("/pogs", async (req: Request, res: Response) => {
      try {
        const connection = await pool.connect();
        const getPogs = `
        SELECT p.id, p.name, p.ticker_symbol AS symbol, p.price, p.color FROM public.Pogs as p
        `;
        const { rows } = await connection.query(getPogs);
        if (rows.length > 0) {
          res.status(200).json(rows);
        } else {
          res.status(404).send("No pogs found!");
        }
        connection.release();
      } catch (err) {
        console.log(err);
        res.status(404);
      }
    })
    .get("/pogs/:id", async (req: Request, res: Response) => {
      const { id } = req.params;
      try {
        const connection = await pool.connect();
        const getPogs = `
          SELECT p.id, p.name, p.ticker_symbol AS symbol, p.price, p.color FROM public.Pogs as p WHERE p.id = $1
          `;
        const { rows } = await connection.query(getPogs, [id]);
        if (rows.length > 0) {
          res.status(200).json(rows);
        } else {
          res.status(404).send("No pogs match!");
        }
        connection.release();
      } catch (err) {
        console.log(err);
        res.status(400);
      }
    });

  app.post("/pogs", async (req: Request, res: Response) => {
    const { name, ticker_symbol, price, color } = req.body;
    try {
      const connection = await pool.connect();
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
      connection.release();
      res.status(201);
    } catch (err) {
      console.log(err);
      res.status(400);
    }
  });

  app.delete("/pogs/:id", async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const connection = await pool.connect();
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
      connection.release();
      res.status(200);
    } catch (err) {
      console.log(err);
      res.status(400);
    }
  });

  //   app.patch("/pogs/:id", async (req: Request, res: Response) => {
  //     const { id } = req.params;
  //     const { name, ticker_symbol, price, color } = req.body;
  //     try {
  //       const connection = await pool.connect();
  //         const updateName;
  //         const updateSymbol;
  //         const updatePrice;
  //         const updateColor;
  //       const result = connection.query(createPog, [
  //         name,
  //         ticker_symbol,
  //         price,
  //         color,
  //       ]);
  //       res.status(200);
  //     } catch (err) {
  //       console.log(err);
  //       res.status(404);
  //     }
  //   })

  app.listen(3000, () => {
    console.log("Server started at http://localhost:3000");
  });
};

startServer();
