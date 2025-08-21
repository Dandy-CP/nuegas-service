/*
  Warnings:

  - You are about to drop the `_TopicAssignments` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_TopicQuizzes` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `topic_id` to the `ClassAssignments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `topic_id` to the `ClassQuiz` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."_TopicAssignments" DROP CONSTRAINT "_TopicAssignments_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_TopicAssignments" DROP CONSTRAINT "_TopicAssignments_B_fkey";

-- DropForeignKey
ALTER TABLE "public"."_TopicQuizzes" DROP CONSTRAINT "_TopicQuizzes_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_TopicQuizzes" DROP CONSTRAINT "_TopicQuizzes_B_fkey";

-- AlterTable
ALTER TABLE "public"."ClassAssignments" ADD COLUMN     "topic_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."ClassQuiz" ADD COLUMN     "topic_id" TEXT NOT NULL;

-- DropTable
DROP TABLE "public"."_TopicAssignments";

-- DropTable
DROP TABLE "public"."_TopicQuizzes";

-- AddForeignKey
ALTER TABLE "public"."ClassAssignments" ADD CONSTRAINT "ClassAssignments_topic_id_fkey" FOREIGN KEY ("topic_id") REFERENCES "public"."ClassTopic"("topic_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ClassQuiz" ADD CONSTRAINT "ClassQuiz_topic_id_fkey" FOREIGN KEY ("topic_id") REFERENCES "public"."ClassTopic"("topic_id") ON DELETE RESTRICT ON UPDATE CASCADE;
