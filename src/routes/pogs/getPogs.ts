import express, { Express, Request, Response } from "express";
import { Pool } from "pg";

export const getPogs = async (app: Express, connection: Pool) => {
  app
    .get("/pogs", async (req: Request, res: Response) => {
      try {
        const getPogs = `
        SELECT p.id, p.name, p.ticker_symbol AS symbol, p.price, p.color FROM public.Pogs as p
        `;
        const { rows } = await connection.query(getPogs);
        if (rows.length > 0) {
          res.status(200).json(rows);
        } else {
          res.status(404).send("No pogs found!");
        }
      } catch (err) {
        console.log(err);
        res.status(404);
      }
    })
    .get("/pogs/:id", async (req: Request, res: Response) => {
      const { id } = req.params;
      try {
        const getPogs = `
          SELECT p.id, p.name, p.ticker_symbol AS symbol, p.price, p.color FROM public.Pogs as p WHERE p.id = $1
          `;
        const { rows } = await connection.query(getPogs, [id]);
        if (rows.length > 0) {
          res.status(200).json(rows);
        } else {
          res.status(404).send("No pogs match!");
        }
      } catch (err) {
        console.log(err);
        res.status(400);
      }
    });
};
