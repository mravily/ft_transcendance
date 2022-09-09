/*
  Warnings:

  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `User` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "ChannelMessage" DROP CONSTRAINT "ChannelMessage_fromId_fkey";

-- DropForeignKey
ALTER TABLE "JoinChannel" DROP CONSTRAINT "JoinChannel_userId_fkey";

-- DropForeignKey
ALTER TABLE "Match" DROP CONSTRAINT "Match_looserid_fkey";

-- DropForeignKey
ALTER TABLE "Match" DROP CONSTRAINT "Match_winnerid_fkey";

-- DropForeignKey
ALTER TABLE "PrivMessage" DROP CONSTRAINT "PrivMessage_fromId_fkey";

-- DropForeignKey
ALTER TABLE "PrivMessage" DROP CONSTRAINT "PrivMessage_toId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_blockedId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_friendId_fkey";

-- DropForeignKey
ALTER TABLE "makeAdmin" DROP CONSTRAINT "makeAdmin_userId_fkey";

-- DropForeignKey
ALTER TABLE "muteUser" DROP CONSTRAINT "muteUser_userId_fkey";

-- DropIndex
DROP INDEX "User_login_key";

-- AlterTable
ALTER TABLE "ChannelMessage" ALTER COLUMN "fromId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "JoinChannel" ALTER COLUMN "userId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Match" ALTER COLUMN "winnerid" SET DATA TYPE TEXT,
ALTER COLUMN "looserid" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "PrivMessage" ALTER COLUMN "fromId" SET DATA TYPE TEXT,
ALTER COLUMN "toId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
DROP COLUMN "id",
ALTER COLUMN "friendId" SET DATA TYPE TEXT,
ALTER COLUMN "blockedId" SET DATA TYPE TEXT,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("login");

-- AlterTable
ALTER TABLE "makeAdmin" ALTER COLUMN "userId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "muteUser" ALTER COLUMN "userId" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_friendId_fkey" FOREIGN KEY ("friendId") REFERENCES "User"("login") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_blockedId_fkey" FOREIGN KEY ("blockedId") REFERENCES "User"("login") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_winnerid_fkey" FOREIGN KEY ("winnerid") REFERENCES "User"("login") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_looserid_fkey" FOREIGN KEY ("looserid") REFERENCES "User"("login") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "makeAdmin" ADD CONSTRAINT "makeAdmin_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("login") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "muteUser" ADD CONSTRAINT "muteUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("login") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JoinChannel" ADD CONSTRAINT "JoinChannel_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("login") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChannelMessage" ADD CONSTRAINT "ChannelMessage_fromId_fkey" FOREIGN KEY ("fromId") REFERENCES "User"("login") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PrivMessage" ADD CONSTRAINT "PrivMessage_fromId_fkey" FOREIGN KEY ("fromId") REFERENCES "User"("login") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PrivMessage" ADD CONSTRAINT "PrivMessage_toId_fkey" FOREIGN KEY ("toId") REFERENCES "User"("login") ON DELETE RESTRICT ON UPDATE CASCADE;
