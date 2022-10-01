/*
  Warnings:

  - A unique constraint covering the columns `[blockedId,blockerId]` on the table `BlockUser` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "BlockUser_blockedId_blockerId_key" ON "BlockUser"("blockedId", "blockerId");
