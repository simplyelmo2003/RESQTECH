-- AlterTable
ALTER TABLE "affectedperson" ADD COLUMN     "barangayId" TEXT;

-- AddForeignKey
ALTER TABLE "affectedperson" ADD CONSTRAINT "affectedperson_barangayId_fkey" FOREIGN KEY ("barangayId") REFERENCES "barangay"("id") ON DELETE SET NULL ON UPDATE CASCADE;
