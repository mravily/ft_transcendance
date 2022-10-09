/*
  Warnings:

  - You are about to drop the column `userId` on the `JoinChannel` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[channelId,login]` on the table `JoinChannel` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `login` to the `JoinChannel` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "JoinChannel" DROP CONSTRAINT "JoinChannel_userId_fkey";

-- DropIndex
DROP INDEX "JoinChannel_channelId_userId_key";

-- AlterTable
ALTER TABLE "JoinChannel" DROP COLUMN "userId",
ADD COLUMN     "login" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "JoinChannel_channelId_login_key" ON "JoinChannel"("channelId", "login");

-- AddForeignKey
ALTER TABLE "JoinChannel" ADD CONSTRAINT "JoinChannel_login_fkey" FOREIGN KEY ("login") REFERENCES "User"("login") ON DELETE RESTRICT ON UPDATE CASCADE;
