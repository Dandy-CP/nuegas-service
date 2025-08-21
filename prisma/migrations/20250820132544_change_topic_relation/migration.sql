/*
  Warnings:

  - You are about to drop the column `assignments_id` on the `ClassTopic` table. All the data in the column will be lost.
  - You are about to drop the column `quiz_id` on the `ClassTopic` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."ClassTopic" DROP CONSTRAINT "ClassTopic_assignments_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."ClassTopic" DROP CONSTRAINT "ClassTopic_quiz_id_fkey";

-- DropIndex
DROP INDEX "public"."ClassTopic_assignments_id_key";

-- DropIndex
DROP INDEX "public"."ClassTopic_quiz_id_key";

-- AlterTable
ALTER TABLE "public"."ClassTopic" DROP COLUMN "assignments_id",
DROP COLUMN "quiz_id";

-- CreateTable
CREATE TABLE "public"."_TopicAssignments" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_TopicAssignments_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "public"."_TopicQuizzes" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_TopicQuizzes_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_TopicAssignments_B_index" ON "public"."_TopicAssignments"("B");

-- CreateIndex
CREATE INDEX "_TopicQuizzes_B_index" ON "public"."_TopicQuizzes"("B");

-- AddForeignKey
ALTER TABLE "public"."_TopicAssignments" ADD CONSTRAINT "_TopicAssignments_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."ClassAssignments"("assignments_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_TopicAssignments" ADD CONSTRAINT "_TopicAssignments_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."ClassTopic"("topic_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_TopicQuizzes" ADD CONSTRAINT "_TopicQuizzes_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."ClassQuiz"("quiz_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_TopicQuizzes" ADD CONSTRAINT "_TopicQuizzes_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."ClassTopic"("topic_id") ON DELETE CASCADE ON UPDATE CASCADE;
