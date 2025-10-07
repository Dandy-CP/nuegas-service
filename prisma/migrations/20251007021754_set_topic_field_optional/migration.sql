-- AlterTable
ALTER TABLE "public"."ClassAssignments" ALTER COLUMN "topic_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."ClassQuiz" ALTER COLUMN "topic_id" DROP NOT NULL;
