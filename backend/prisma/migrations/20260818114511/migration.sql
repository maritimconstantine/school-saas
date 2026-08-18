/*
  Warnings:

  - You are about to drop the column `receivedById` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the column `transactionNumber` on the `Payment` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[transactionReference]` on the table `Payment` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `recordedById` to the `Payment` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `paymentMethod` on the `Payment` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_academicYearId_fkey";

-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_receivedById_fkey";

-- DropIndex
DROP INDEX "Payment_academicYearId_idx";

-- DropIndex
DROP INDEX "Payment_amount_idx";

-- DropIndex
DROP INDEX "Payment_paymentMethod_idx";

-- DropIndex
DROP INDEX "Payment_status_idx";

-- DropIndex
DROP INDEX "Payment_transactionNumber_idx";

-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "receivedById",
DROP COLUMN "status",
DROP COLUMN "transactionNumber",
ADD COLUMN     "recordedById" TEXT NOT NULL,
ADD COLUMN     "transactionReference" TEXT,
ALTER COLUMN "academicYearId" DROP NOT NULL,
DROP COLUMN "paymentMethod",
ADD COLUMN     "paymentMethod" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Payment_transactionReference_key" ON "Payment"("transactionReference");

-- CreateIndex
CREATE INDEX "Payment_recordedById_idx" ON "Payment"("recordedById");

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_recordedById_fkey" FOREIGN KEY ("recordedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_academicYearId_fkey" FOREIGN KEY ("academicYearId") REFERENCES "AcademicYear"("id") ON DELETE SET NULL ON UPDATE CASCADE;
