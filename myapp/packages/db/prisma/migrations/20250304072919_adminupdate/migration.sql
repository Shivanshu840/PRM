/*
  Warnings:

  - You are about to drop the column `Firstname` on the `Admin` table. All the data in the column will be lost.
  - Added the required column `FirstName` to the `Admin` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Admin" DROP COLUMN "Firstname",
ADD COLUMN     "FirstName" TEXT NOT NULL;
