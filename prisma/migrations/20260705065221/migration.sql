/*
  Warnings:

  - A unique constraint covering the columns `[paymongoPaymentIntentId]` on the table `Order` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "paymongoPaymentIntentId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Order_paymongoPaymentIntentId_key" ON "Order"("paymongoPaymentIntentId");
