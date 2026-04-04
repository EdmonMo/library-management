/*
  Warnings:

  - You are about to drop the column `availableCopies` on the `Book` table. All the data in the column will be lost.
  - You are about to drop the column `totalCopies` on the `Book` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Book" DROP COLUMN "availableCopies",
DROP COLUMN "totalCopies";
