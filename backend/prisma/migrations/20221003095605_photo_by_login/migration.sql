-- DropForeignKey
ALTER TABLE "Photos" DROP CONSTRAINT "Photos_userId_fkey";

-- AddForeignKey
ALTER TABLE "Photos" ADD CONSTRAINT "Photos_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("login") ON DELETE RESTRICT ON UPDATE CASCADE;
