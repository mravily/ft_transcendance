/*
  Warnings:

  - A unique constraint covering the columns `[filename]` on the table `Photos` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[path]` on the table `Photos` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,path]` on the table `Photos` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[login]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `duration` to the `BanUser` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "AddFriend" DROP CONSTRAINT "AddFriend_requestedId_fkey";

-- DropForeignKey
ALTER TABLE "BanUser" DROP CONSTRAINT "BanUser_userId_fkey";

-- DropForeignKey
ALTER TABLE "BlockUser" DROP CONSTRAINT "BlockUser_blockedId_fkey";

-- DropForeignKey
ALTER TABLE "Match" DROP CONSTRAINT "Match_looserid_fkey";

-- DropForeignKey
ALTER TABLE "Match" DROP CONSTRAINT "Match_winnerid_fkey";

-- DropForeignKey
ALTER TABLE "makeAdmin" DROP CONSTRAINT "makeAdmin_userId_fkey";

-- DropForeignKey
ALTER TABLE "muteUser" DROP CONSTRAINT "muteUser_userId_fkey";

-- DropIndex
DROP INDEX "Photos_userId_key";

-- AlterTable
ALTER TABLE "BanUser" ADD COLUMN     "duration" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Match" ALTER COLUMN "winnerScore" DROP NOT NULL,
ALTER COLUMN "looserScore" DROP NOT NULL,
ALTER COLUMN "winnerid" DROP NOT NULL,
ALTER COLUMN "looserid" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Photos_filename_key" ON "Photos"("filename");

-- CreateIndex
CREATE UNIQUE INDEX "Photos_path_key" ON "Photos"("path");

-- CreateIndex
CREATE UNIQUE INDEX "Photos_userId_path_key" ON "Photos"("userId", "path");

-- CreateIndex
CREATE UNIQUE INDEX "User_login_key" ON "User"("login");

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_winnerid_fkey" FOREIGN KEY ("winnerid") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_looserid_fkey" FOREIGN KEY ("looserid") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "makeAdmin" ADD CONSTRAINT "makeAdmin_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("login") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "muteUser" ADD CONSTRAINT "muteUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("login") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BanUser" ADD CONSTRAINT "BanUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("login") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AddFriend" ADD CONSTRAINT "AddFriend_requestedId_fkey" FOREIGN KEY ("requestedId") REFERENCES "User"("login") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlockUser" ADD CONSTRAINT "BlockUser_blockedId_fkey" FOREIGN KEY ("blockedId") REFERENCES "User"("login") ON DELETE RESTRICT ON UPDATE CASCADE;
