-- AlterTable
ALTER TABLE "Tool" ADD COLUMN     "features" TEXT[],
ADD COLUMN     "lastTestedAt" TIMESTAMP(3),
ADD COLUMN     "limitations" TEXT,
ADD COLUMN     "parentCompany" TEXT,
ADD COLUMN     "tutorials" TEXT[],
ADD COLUMN     "usageTip" TEXT,
ADD COLUMN     "verifiedBy" TEXT;
