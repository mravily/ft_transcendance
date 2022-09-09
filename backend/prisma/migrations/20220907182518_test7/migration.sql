/*
  Warnings:

  - The primary key for the `Channel` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Channel` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "ChannelMessage" DROP CONSTRAINT "ChannelMessage_channelId_fkey";

-- DropForeignKey
ALTER TABLE "JoinChannel" DROP CONSTRAINT "JoinChannel_channelId_fkey";

-- DropForeignKey
ALTER TABLE "makeAdmin" DROP CONSTRAINT "makeAdmin_channelId_fkey";

-- DropForeignKey
ALTER TABLE "muteUser" DROP CONSTRAINT "muteUser_channelId_fkey";

-- DropIndex
DROP INDEX "Channel_channelName_key";

-- AlterTable
ALTER TABLE "Channel" DROP CONSTRAINT "Channel_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "Channel_pkey" PRIMARY KEY ("channelName");

-- AlterTable
ALTER TABLE "ChannelMessage" ALTER COLUMN "channelId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "JoinChannel" ALTER COLUMN "channelId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "makeAdmin" ALTER COLUMN "channelId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "muteUser" ALTER COLUMN "channelId" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "makeAdmin" ADD CONSTRAINT "makeAdmin_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "Channel"("channelName") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "muteUser" ADD CONSTRAINT "muteUser_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "Channel"("channelName") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JoinChannel" ADD CONSTRAINT "JoinChannel_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "Channel"("channelName") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChannelMessage" ADD CONSTRAINT "ChannelMessage_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "Channel"("channelName") ON DELETE RESTRICT ON UPDATE CASCADE;
