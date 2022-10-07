/*
  Warnings:

  - You are about to drop the column `createdAd` on the `AddFriend` table. All the data in the column will be lost.
  - You are about to drop the column `twoFApwd` on the `User` table. All the data in the column will be lost.
  - Added the required column `mimetype` to the `Photos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `size` to the `Photos` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Photos" DROP CONSTRAINT "Photos_userId_fkey";

-- AlterTable
ALTER TABLE "AddFriend" DROP COLUMN "createdAd",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Photos" ADD COLUMN     "mimetype" TEXT NOT NULL,
ADD COLUMN     "size" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "twoFApwd",
ADD COLUMN     "dataUrl" TEXT,
ADD COLUMN     "secret" TEXT;

-- AddForeignKey
ALTER TABLE "Photos" ADD CONSTRAINT "Photos_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
