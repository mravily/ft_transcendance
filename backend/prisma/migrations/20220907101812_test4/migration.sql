/*
  Warnings:

  - You are about to drop the column `ChannelName` on the `Channel` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[channelName]` on the table `Channel` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `channelName` to the `Channel` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Channel_ChannelName_key";

-- AlterTable
ALTER TABLE "Channel" DROP COLUMN "ChannelName",
ADD COLUMN     "channelName" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Channel_channelName_key" ON "Channel"("channelName");
