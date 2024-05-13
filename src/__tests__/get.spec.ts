import supertest from "supertest";
import { startServer } from "../utils/startServer";
import { PrismaClient } from "@prisma/client";

const app = startServer();
const prisma = new PrismaClient();

describe("Get Pogs", () => {
  beforeEach(async () => {
    await prisma.pogs.deleteMany();
  });

  afterEach(async () => {
    await prisma.pogs.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe("Get Pogs", () => {
    const data: any = [
      {
        name: "Test Pog",
        ticker_symbol: "TPOG",
        price: 10.99,
        color: "red",
      },
      {
        name: "Test Pog 2",
        ticker_symbol: "TPOG2",
        price: 20.99,
        color: "blue",
      },
      {
        name: "Test Pog 3",
        ticker_symbol: "TPOG3",
        price: 30.99,
        color: "green",
      },
    ];

    it("should get all pogs", async () => {
      await prisma.pogs.createMany({
        data,
      });
      const { statusCode, body } = await supertest(app).get("/pogs");

      expect(statusCode).toBe(200);
      expect(body.length).toBe(3);
    }, 10000);

    it("should get retrieve zero pogs", async () => {
      const { statusCode, body } = await supertest(app).get("/pogs");

      expect(statusCode).toBe(404);
      expect(body.length).toBe(0);
    }, 10000);

    it("should get specific pog", async () => {
      const pog = await prisma.pogs.create({
        data: data[0],
      });

      const id = pog.id;

      const { statusCode, body } = await supertest(app).get(`/pogs/${id}`);

      console.log(body);

      expect(statusCode).toBe(200);
      expect(body).toEqual(pog);
    }, 10000);

    it("should get non existant pog", async () => {
      const id = 5000;

      const { statusCode, body } = await supertest(app).get(`/pogs/${id}`);

      console.log(body);

      expect(statusCode).toBe(404);
      expect(body).toEqual(null);
    }, 10000);
  });
});
