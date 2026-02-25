-- AlterTable
ALTER TABLE "Tweet" ADD COLUMN     "parentTweetId" TEXT,
ADD COLUMN     "type" TEXT NOT NULL DEFAULT 'T';

-- AddForeignKey
ALTER TABLE "Tweet" ADD CONSTRAINT "Tweet_parentTweetId_fkey" FOREIGN KEY ("parentTweetId") REFERENCES "Tweet"("id") ON DELETE SET NULL ON UPDATE CASCADE;
