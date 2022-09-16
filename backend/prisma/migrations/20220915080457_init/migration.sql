/*
  Warnings:

  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `User` table. All the data in the column will be lost.
  - Added the required column `level` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `login` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `role` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `score` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `token` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `twoFA` to the `User` table without a default value. This is not possible if the table is not empty.
  - Made the column `name` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('OnLine', 'OffLine');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('User', 'Admin');

-- CreateEnum
CREATE TYPE "ChannelStatus" AS ENUM ('Active', 'Inactive');

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
DROP COLUMN "id",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "level" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "login" TEXT NOT NULL,
ADD COLUMN     "photo" TEXT,
ADD COLUMN     "role" "UserRole" NOT NULL,
ADD COLUMN     "score" INTEGER NOT NULL,
ADD COLUMN     "status" "UserStatus" NOT NULL,
ADD COLUMN     "token" TEXT NOT NULL,
ADD COLUMN     "twoFA" BOOLEAN NOT NULL,
ADD COLUMN     "twoFApwd" TEXT,
ALTER COLUMN "name" SET NOT NULL,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("login");

-- CreateTable
CREATE TABLE "Match" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "winnerScore" INTEGER NOT NULL,
    "looserScore" INTEGER NOT NULL,
    "winnerid" TEXT NOT NULL,
    "looserid" TEXT NOT NULL,

    CONSTRAINT "Match_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Channel" (
    "channelName" TEXT NOT NULL,
    "pwd" TEXT,
    "status" "ChannelStatus" NOT NULL,

    CONSTRAINT "Channel_pkey" PRIMARY KEY ("channelName")
);

-- CreateTable
CREATE TABLE "makeAdmin" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "channelId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "makeAdmin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "muteUser" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "channelId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "muteUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JoinChannel" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "channelId" TEXT NOT NULL,

    CONSTRAINT "JoinChannel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChannelMessage" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "message" TEXT NOT NULL,
    "fromId" TEXT NOT NULL,
    "channelId" TEXT NOT NULL,

    CONSTRAINT "ChannelMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PrivMessage" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "message" TEXT NOT NULL,
    "fromId" TEXT NOT NULL,
    "toId" TEXT NOT NULL,

    CONSTRAINT "PrivMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AddFriend" (
    "id" SERIAL NOT NULL,
    "createdAd" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "friend1Id" TEXT NOT NULL,
    "friend2Id" TEXT NOT NULL,

    CONSTRAINT "AddFriend_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BlockUser" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "blockerId" TEXT NOT NULL,
    "blockedId" TEXT NOT NULL,

    CONSTRAINT "BlockUser_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "makeAdmin_channelId_userId_key" ON "makeAdmin"("channelId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "muteUser_channelId_userId_key" ON "muteUser"("channelId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "JoinChannel_channelId_userId_key" ON "JoinChannel"("channelId", "userId");

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_winnerid_fkey" FOREIGN KEY ("winnerid") REFERENCES "User"("login") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_looserid_fkey" FOREIGN KEY ("looserid") REFERENCES "User"("login") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "makeAdmin" ADD CONSTRAINT "makeAdmin_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "Channel"("channelName") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "makeAdmin" ADD CONSTRAINT "makeAdmin_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("login") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "muteUser" ADD CONSTRAINT "muteUser_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "Channel"("channelName") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "muteUser" ADD CONSTRAINT "muteUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("login") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JoinChannel" ADD CONSTRAINT "JoinChannel_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("login") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JoinChannel" ADD CONSTRAINT "JoinChannel_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "Channel"("channelName") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChannelMessage" ADD CONSTRAINT "ChannelMessage_fromId_fkey" FOREIGN KEY ("fromId") REFERENCES "User"("login") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChannelMessage" ADD CONSTRAINT "ChannelMessage_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "Channel"("channelName") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PrivMessage" ADD CONSTRAINT "PrivMessage_fromId_fkey" FOREIGN KEY ("fromId") REFERENCES "User"("login") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PrivMessage" ADD CONSTRAINT "PrivMessage_toId_fkey" FOREIGN KEY ("toId") REFERENCES "User"("login") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AddFriend" ADD CONSTRAINT "AddFriend_friend1Id_fkey" FOREIGN KEY ("friend1Id") REFERENCES "User"("login") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AddFriend" ADD CONSTRAINT "AddFriend_friend2Id_fkey" FOREIGN KEY ("friend2Id") REFERENCES "User"("login") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlockUser" ADD CONSTRAINT "BlockUser_blockerId_fkey" FOREIGN KEY ("blockerId") REFERENCES "User"("login") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlockUser" ADD CONSTRAINT "BlockUser_blockedId_fkey" FOREIGN KEY ("blockedId") REFERENCES "User"("login") ON DELETE RESTRICT ON UPDATE CASCADE;
