-- AlterTable
ALTER TABLE "StudentActivities" ADD COLUMN     "aiRecommendations" JSONB NOT NULL DEFAULT '{}';

-- AlterTable
ALTER TABLE "StudentColleges" ADD COLUMN     "aiRecommendations" JSONB NOT NULL DEFAULT '{}';

-- AlterTable
ALTER TABLE "StudentDecide" ADD COLUMN     "aiRecommendations" JSONB NOT NULL DEFAULT '{}';

-- AlterTable
ALTER TABLE "StudentExams" ADD COLUMN     "aiRecommendations" JSONB NOT NULL DEFAULT '{}';

-- AlterTable
ALTER TABLE "StudentFinancialAid" ADD COLUMN     "aiRecommendations" JSONB NOT NULL DEFAULT '{}';
