/*
  Warnings:

  - You are about to drop the column `atoken` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `rtoken` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[token]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "User_atoken_key";

-- DropIndex
DROP INDEX "User_rtoken_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "atoken",
DROP COLUMN "rtoken",
ADD COLUMN     "token" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_token_key" ON "User"("token");
