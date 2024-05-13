-- CreateTable
CREATE TABLE "Pogs" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "ticker_symbol" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Pogs_pkey" PRIMARY KEY ("id")
);
