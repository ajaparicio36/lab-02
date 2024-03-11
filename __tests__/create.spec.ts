import request from "supertest";
import express, { Express } from "express";
import { Pool } from "pg";
import dotenv from "dotenv";
import { createPogs } from "../src/routes/pogs/createPogs";
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

    createPogs(app, connection);
  });

  afterAll(() => {
    connection.end();
  });

  describe("POST /pogs", () => {
    it("should create a new pog", async () => {
      const res = await request(app).post("/pogs").send({
        name: "New Pog",
        symbol: "NPG",
        price: 100,
        color: "red",
      });

      expect(res.status).toBe(201);
    });

    it("should return 422 for missing data", async () => {
      const res = await request(app).post("/pogs").send({
        name: "Incomplete Pog",
        symbol: "",
        price: 0,
        color: "",
      });

      expect(res.status).toBe(422);
    });
  });

  describe("DELETE /pogs/:id", () => {
    it("should delete a pog", async () => {
      // Create a new pog for testing
      const createRes = await request(app).post("/pogs").send({
        name: "Pog to be deleted",
        symbol: "PTBD",
        price: 50,
        color: "green",
      });

      const pogId = createRes.body.id;

      const res = await request(app).delete(`/pogs/${pogId}`);

      expect(res.status).toBe(200);
    });

    it("should return 404 for non-existent pog", async () => {
      const res = await request(app).delete("/pogs/999");

      expect(res.status).toBe(404);
    });
  });
});
