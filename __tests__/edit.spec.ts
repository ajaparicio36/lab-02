import request from "supertest";
import { Pool } from "pg";
import dotenv from "dotenv";
import express, { Express } from "express";
import { editPogs } from "../src/routes/pogs/editPogs";
import { startServer } from "../src/index";

describe("editPogs", () => {
  dotenv.config();
  let app: Express;
  let connection: Pool;

  beforeAll(async () => {
    app = await startServer();
    connection = new Pool({
      connectionString: `${process.env.DATABASE_URL}`,
    });

    editPogs(app, connection);
  });

  afterAll(() => {
    connection.end();
  });

  describe("PATCH /pogs/:id", () => {
    it("should update a pog with valid data", async () => {
      const res = await request(app).patch("/pogs/1").send({
        name: "Updated Pog",
        symbol: "UPG",
        price: 99,
        color: "blue",
      });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("name", "Updated Pog");
      expect(res.body).toHaveProperty("ticker_symbol", "UPG");
      expect(res.body).toHaveProperty("price", 99);
      expect(res.body).toHaveProperty("color", "blue");
    });

    it("should update a pog with partial data", async () => {
      const res = await request(app).patch("/pogs/1").send({
        name: "",
        symbol: "NEW",
        price: "",
        color: "",
      });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("ticker_symbol", "NEW");
    });

    it("should return 400 for invalid id", async () => {
      const res = await request(app).patch("/pogs/invalid");

      expect(res.status).toBe(400);
    });

    it("should return 404 for non-existent pog", async () => {
      const res = await request(app).patch("/pogs/999");

      expect(res.status).toBe(404);
    });
  });
});
