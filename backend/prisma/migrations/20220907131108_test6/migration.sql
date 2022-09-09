/*
  Warnings:

  - You are about to drop the column `blockedId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `friendId` on the `User` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_blockedId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_friendId_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "blockedId",
DROP COLUMN "friendId";

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

-- AddForeignKey
ALTER TABLE "AddFriend" ADD CONSTRAINT "AddFriend_friend1Id_fkey" FOREIGN KEY ("friend1Id") REFERENCES "User"("login") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AddFriend" ADD CONSTRAINT "AddFriend_friend2Id_fkey" FOREIGN KEY ("friend2Id") REFERENCES "User"("login") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlockUser" ADD CONSTRAINT "BlockUser_blockerId_fkey" FOREIGN KEY ("blockerId") REFERENCES "User"("login") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlockUser" ADD CONSTRAINT "BlockUser_blockedId_fkey" FOREIGN KEY ("blockedId") REFERENCES "User"("login") ON DELETE RESTRICT ON UPDATE CASCADE;
