-- CreateEnum
CREATE TYPE "TargetRegion" AS ENUM ('GLOBAL', 'INDIA');

-- CreateEnum
CREATE TYPE "ArticleType" AS ENUM ('NEWS', 'BLOG');

-- AlterTable
ALTER TABLE "News" ADD COLUMN     "contentType" "ArticleType" NOT NULL DEFAULT 'NEWS',
ADD COLUMN     "hypeLevel" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "quickTake" TEXT,
ADD COLUMN     "realityClaim" TEXT,
ADD COLUMN     "realityTruth" TEXT,
ADD COLUMN     "region" "TargetRegion" NOT NULL DEFAULT 'GLOBAL';

-- AlterTable
ALTER TABLE "Tool" ADD COLUMN     "bestUsedFor" TEXT,
ADD COLUMN     "platforms" TEXT[],
ADD COLUMN     "popularityScore" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
ADD COLUMN     "startingPrice" TEXT,
ADD COLUMN     "viewsCount" INTEGER NOT NULL DEFAULT 0;
