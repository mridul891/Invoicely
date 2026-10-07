-- CreateEnum
CREATE TYPE "DiscountType" AS ENUM ('None', 'Percentage', 'Fixed');

-- AlterTable
ALTER TABLE "invoice" ADD COLUMN     "discount_type" "DiscountType" NOT NULL DEFAULT 'None',
ADD COLUMN     "discount_value" DECIMAL(12,2) NOT NULL DEFAULT 0;
