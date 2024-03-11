import express, { Express, Response, Request } from "express";
import { Pool } from "pg";

export const editPogs = async (app: Express, connection: Pool) => {
  app.patch("/pogs/:id", async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, symbol, price, color } = req.body;
    let updatedName: string | null,
      updatedSymbol: string | null,
      updatedPrice: number | null,
      updatedColor: string | null;

    const intId = parseInt(id, 10);
    if (isNaN(intId)) {
      return res.status(400);
    }

    if (name.length === 0) updatedName = null;
    else updatedName = String(name);

    if (symbol.length === 0) updatedSymbol = null;
    else updatedSymbol = String(symbol);

    if (price.length === 0) updatedPrice = null;
    else updatedPrice = Number(price);

    if (color.length === 0) updatedColor = null;
    else updatedColor = String(color);

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
        updatedName,
        updatedSymbol,
        updatedPrice,
        updatedColor,
        intId,
      ]);
      if (rows.length > 0) {
        res.status(200).json(rows[0]);
      } else {
        throw new Error();
      }
    } catch (err) {
      res.status(404);
    }
  });
};
