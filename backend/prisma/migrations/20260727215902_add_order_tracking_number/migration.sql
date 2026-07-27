-- AlterTable
ALTER TABLE "orders" ADD COLUMN "trackingNumber" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "orders_trackingNumber_key" ON "orders"("trackingNumber");
