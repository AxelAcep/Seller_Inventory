/*
  Warnings:

  - Added the required column `harga` to the `order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "customer" ADD COLUMN     "saldo" INTEGER;

-- AlterTable
ALTER TABLE "order" ADD COLUMN     "harga" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "saldo" INTEGER;
