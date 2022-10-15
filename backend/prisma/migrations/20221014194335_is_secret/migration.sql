/*
  Warnings:

  - Added the required column `isNotif` to the `ChannelMessage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isSecret` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ChannelMessage" ADD COLUMN     "isNotif" BOOLEAN NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isSecret" BOOLEAN NOT NULL;
