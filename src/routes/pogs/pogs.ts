import express, { Express, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  log: ["query", "error"],
});

export const routes = (app: Express) => {
  app.post("/pogs", async (req: Request, res: Response) => {
    const { name, ticker_symbol, price, color } = req.body;
    const data = {
      name,
      ticker_symbol,
      price,
      color,
    };
    try {
      const user = await prisma.pogs.create({
        data: {
          name: data.name,
          ticker_symbol: data.ticker_symbol,
          price: data.price,
          color: data.color,
        },
      });
      res.status(201).json(user);
    } catch (err) {
      console.log(err);
      res.status(422).json();
    } finally {
      await prisma.$disconnect;
    }
  });

  app.delete("/pogs/:id", async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      await prisma.pogs.delete({
        where: {
          id: parseInt(id),
        },
      });

      res.status(200).json();
    } catch (err) {
      console.log(err);
      res.status(404).json();
    } finally {
      await prisma.$disconnect;
    }
  });
  app.patch("/pogs/:id", async (req: Request, res: Response) => {
    const { id } = req.params;
    const { editedData } = req.body;

    try {
      console.log("pog", editedData, id);
      const pog = await prisma.pogs.update({
        where: { id: parseInt(id) },
        data: editedData,
      });
      console.log("pog", pog);

      if (pog) {
        res.status(202).json(pog);
      } else {
        throw new Error("Pog not found!");
      }
    } catch (err) {
      res.status(404).json();
    } finally {
      await prisma.$disconnect;
    }
  });

  app
    .get("/pogs", async (req: Request, res: Response) => {
      try {
        const pogs = await prisma.pogs.findMany();
        if (pogs.length > 0) {
          res.status(200).json(pogs);
        } else {
          throw new Error("Did not match any pogs!");
        }
      } catch (err) {
        console.log(err);
        res.status(404).json([]);
      }
    })
    .get("/pogs/:id", async (req: Request, res: Response) => {
      const { id } = req.params;
      try {
        const pog = await prisma.pogs.findUnique({
          where: {
            id: parseInt(id),
          },
        });
        if (pog) {
          res.status(200).json(pog);
        } else {
          throw new Error("Pog not found!");
        }
      } catch (err) {
        res.status(404).json(null);
      } finally {
        await prisma.$disconnect;
      }
    });
};
