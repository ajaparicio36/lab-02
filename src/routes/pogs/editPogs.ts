import express, { Express, Response, Request } from "express";
import { Pool } from "pg";

export const editPogs = async (app: Express, connection: Pool) => {
  app.patch("/pogs/:id", async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, ticker_symbol, price, color } = req.body;
    try {
      const updatePog = `
             UPDATE Pogs
             SET name = COALESCE($1, name),
                 ticker_symbol = COALESCE($2, ticker_symbol),
                 price = COALESCE($3, price),
                 color = COALESCE($4, color)
             WHERE id = $5
             RETURNING *
           `;
      const { rows } = await connection.query(updatePog, [
        name,
        ticker_symbol,
        price,
        color,
        id,
      ]);
      if (rows.length > 0) {
        res.status(200).json(rows[0]);
      } else {
        res.status(404).send("No pog found to update!");
      }
    } catch (err) {
      console.log(err);
      res.status(500).send("Error updating pog");
    }
  });
};
