import supertest from "supertest";
import { startServer } from "../utils/startServer";
import { PrismaClient } from "@prisma/client";

const app = startServer();
const prisma = new PrismaClient();

describe("Edit Pogs", () => {
  beforeEach(async () => {
    await prisma.pogs.deleteMany();
  });

  afterEach(async () => {
    await prisma.pogs.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe("Edit Pogs", () => {
    const data: any = {
      name: "Test Pog",
      ticker_symbol: "TPOG",
      price: 10.99,
      color: "red",
    };
    it("should edit a pog", async () => {
      const pog = await prisma.pogs.create({
        data,
      });

      const editedData: any = {
        name: "Edited Pog",
        ticker_symbol: "EPOG",
        price: 69,
        color: "magenta",
      };

      const { statusCode, body } = await supertest(app)
        .patch(`/pogs/${pog.id}`)
        .send({
          editedData,
        });

      expect(statusCode).toBe(202);
      expect(body).toEqual({ ...editedData, id: body.id });
    }, 10000);

    it("should edit non-existant pog", async () => {
      const editedData: any = {
        name: "Edited Pog",
        ticker_symbol: "EPOG",
        price: 69,
        color: "magenta",
      };

      const { statusCode } = await supertest(app).patch(`/pogs/5000`).send({
        editedData,
      });

      expect(statusCode).toBe(404);
    }, 10000);

    it("should edit with invalid value", async () => {
      const pog = await prisma.pogs.create({
        data,
      });

      const editedData: any = {
        name: "Edited Pog",
        ticker_symbol: "EPOG",
        price: 69,
        color: "magenta",
      };

      const { statusCode } = await supertest(app)
        .patch(`/pogs/${pog.id}`)
        .send({
          ...editedData,
          ticker_symbol: 1,
        });

      expect(statusCode).toBe(404);
    }, 10000);
  });
});
