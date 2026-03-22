-- AlterTable
ALTER TABLE "Comment" ADD COLUMN     "userAvatar" TEXT,
ADD COLUMN     "userId" TEXT,
ADD COLUMN     "userName" TEXT;

-- AlterTable
ALTER TABLE "News" ADD COLUMN     "focusKeyphrase" TEXT;

-- AlterTable
ALTER TABLE "Tool" ADD COLUMN     "focusKeyphrase" TEXT;
