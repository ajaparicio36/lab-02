import request from "supertest";
import express, { Express } from "express";
import { Pool } from "pg";
import dotenv from "dotenv";
import { getPogs } from "../src/routes/pogs/getPogs";
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

    getPogs(app, connection);
  });

  afterAll(() => {
    connection.end();
  });

  describe("GET /pogs", () => {
    it("should return all pogs", async () => {
      const res = await request(app).get("/pogs");

      expect(res.status).toBe(200);
      expect(res.body).toBeInstanceOf(Array);
    });

    it("should return 404 if no pogs exist", async () => {
      // Assuming no pogs exist in the database
      const res = await request(app).get("/pogs");

      expect(res.status).toBe(404);
    });
  });

  describe("GET /pogs/:id", () => {
    it("should return a pog by id", async () => {
      const pogId = 1; // Assuming a pog with id 1 exists in the database

      const res = await request(app).get(`/pogs/${pogId}`);

      expect(res.status).toBe(200);
      expect(res.body).toBeInstanceOf(Array);
      expect(res.body.length).toBe(1);
      expect(res.body[0].id).toBe(pogId);
    });

    it("should return 404 for non-existent pog", async () => {
      const nonExistentPogId = 999;

      const res = await request(app).get(`/pogs/${nonExistentPogId}`);

      expect(res.status).toBe(404);
    });

    it("should return 404 for invalid id", async () => {
      const invalidId = "invalid";

      const res = await request(app).get(`/pogs/${invalidId}`);

      expect(res.status).toBe(404);
    });
  });
});
