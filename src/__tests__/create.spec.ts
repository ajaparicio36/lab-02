import supertest from "supertest";
import { startServer } from "../utils/startServer";
import { PrismaClient } from "@prisma/client";

const app = startServer();
const prisma = new PrismaClient();

describe("Create and Delete Pogs", () => {
  beforeEach(async () => {
    await prisma.pogs.deleteMany();
  });

  afterEach(async () => {
    await prisma.pogs.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe("Create Pogs", () => {
    const data: any = {
      name: "Test Pog",
      ticker_symbol: "TPOG",
      price: 10.99,
      color: "red",
    };

    it("should create a new pog", async () => {
      const { statusCode, body } = await supertest(app)
        .post("/pogs")
        .send(data);
      const pogs = await prisma.pogs.findMany();
      console.log("body data", body);
      expect(statusCode).toBe(201);
      expect(pogs.length).toBe(1);
    }, 10000);

    it("should create an invalid pog", async () => {
      const invalidData = {
        ...data,
        ticker_symbol: 1,
      };
      const { statusCode } = await supertest(app)
        .post("/pogs")
        .send(invalidData);
      const pogs = await prisma.pogs.findMany();
      expect(statusCode).toBe(422);
      expect(pogs.length).toBe(0);
    }, 10000);

    it("should delete a new pog", async () => {
      const pog = await prisma.pogs.create({
        data,
      });
      const { statusCode } = await supertest(app).delete(`/pogs/${pog.id}`);
      const pogs = await prisma.pogs.findMany();
      expect(statusCode).toBe(200);
      expect(pogs.length).toBe(0);
    }, 10000);

    it("should try to delete at non existant pog", async () => {
      const { statusCode } = await supertest(app).delete(`/pogs/255`);
      const pogs = await prisma.pogs.findMany();
      expect(statusCode).toBe(404);
      expect(pogs.length).toBe(0);
    }, 10000);
  });
});
