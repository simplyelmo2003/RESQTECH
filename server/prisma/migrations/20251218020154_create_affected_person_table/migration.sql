/*
  Warnings:

  - You are about to drop the column `households` on the `incidentreport` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "incidentreport" DROP COLUMN "households";

-- CreateTable
CREATE TABLE "affectedperson" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "sex" TEXT,
    "age" INTEGER,
    "purok" TEXT,
    "birthday" TIMESTAMP(3),
    "affected" BOOLEAN NOT NULL DEFAULT false,
    "evacuated" BOOLEAN NOT NULL DEFAULT false,
    "incidentReportId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "affectedperson_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "affectedperson" ADD CONSTRAINT "affectedperson_incidentReportId_fkey" FOREIGN KEY ("incidentReportId") REFERENCES "incidentreport"("id") ON DELETE CASCADE ON UPDATE CASCADE;
