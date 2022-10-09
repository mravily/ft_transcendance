/*
  Warnings:

  - You are about to drop the column `requestedId` on the `AddFriend` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `BanUser` table. All the data in the column will be lost.
  - You are about to drop the column `blockedId` on the `BlockUser` table. All the data in the column will be lost.
  - You are about to drop the column `fromId` on the `ChannelMessage` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `makeAdmin` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `muteUser` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[channelId,login]` on the table `BanUser` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[blockedLogin,blockerId]` on the table `BlockUser` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[channelId,login]` on the table `makeAdmin` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[channelId,login]` on the table `muteUser` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `requestedLogin` to the `AddFriend` table without a default value. This is not possible if the table is not empty.
  - Added the required column `login` to the `BanUser` table without a default value. This is not possible if the table is not empty.
  - Added the required column `blockedLogin` to the `BlockUser` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `ChannelMessage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `login` to the `makeAdmin` table without a default value. This is not possible if the table is not empty.
  - Added the required column `login` to the `muteUser` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "AddFriend" DROP CONSTRAINT "AddFriend_requestedId_fkey";

-- DropForeignKey
ALTER TABLE "BanUser" DROP CONSTRAINT "BanUser_userId_fkey";

-- DropForeignKey
ALTER TABLE "BlockUser" DROP CONSTRAINT "BlockUser_blockedId_fkey";

-- DropForeignKey
ALTER TABLE "ChannelMessage" DROP CONSTRAINT "ChannelMessage_fromId_fkey";

-- DropForeignKey
ALTER TABLE "makeAdmin" DROP CONSTRAINT "makeAdmin_userId_fkey";

-- DropForeignKey
ALTER TABLE "muteUser" DROP CONSTRAINT "muteUser_userId_fkey";

-- DropIndex
DROP INDEX "BanUser_channelId_userId_key";

-- DropIndex
DROP INDEX "BlockUser_blockedId_blockerId_key";

-- DropIndex
DROP INDEX "makeAdmin_channelId_userId_key";

-- DropIndex
DROP INDEX "muteUser_channelId_userId_key";

-- AlterTable
ALTER TABLE "AddFriend" DROP COLUMN "requestedId",
ADD COLUMN     "requestedLogin" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "BanUser" DROP COLUMN "userId",
ADD COLUMN     "login" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "BlockUser" DROP COLUMN "blockedId",
ADD COLUMN     "blockedLogin" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ChannelMessage" DROP COLUMN "fromId",
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "makeAdmin" DROP COLUMN "userId",
ADD COLUMN     "login" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "muteUser" DROP COLUMN "userId",
ADD COLUMN     "login" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "BanUser_channelId_login_key" ON "BanUser"("channelId", "login");

-- CreateIndex
CREATE UNIQUE INDEX "BlockUser_blockedLogin_blockerId_key" ON "BlockUser"("blockedLogin", "blockerId");

-- CreateIndex
CREATE UNIQUE INDEX "makeAdmin_channelId_login_key" ON "makeAdmin"("channelId", "login");

-- CreateIndex
CREATE UNIQUE INDEX "muteUser_channelId_login_key" ON "muteUser"("channelId", "login");

-- AddForeignKey
ALTER TABLE "makeAdmin" ADD CONSTRAINT "makeAdmin_login_fkey" FOREIGN KEY ("login") REFERENCES "User"("login") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "muteUser" ADD CONSTRAINT "muteUser_login_fkey" FOREIGN KEY ("login") REFERENCES "User"("login") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BanUser" ADD CONSTRAINT "BanUser_login_fkey" FOREIGN KEY ("login") REFERENCES "User"("login") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChannelMessage" ADD CONSTRAINT "ChannelMessage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AddFriend" ADD CONSTRAINT "AddFriend_requestedLogin_fkey" FOREIGN KEY ("requestedLogin") REFERENCES "User"("login") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlockUser" ADD CONSTRAINT "BlockUser_blockedLogin_fkey" FOREIGN KEY ("blockedLogin") REFERENCES "User"("login") ON DELETE RESTRICT ON UPDATE CASCADE;
