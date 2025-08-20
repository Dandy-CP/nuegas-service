/*
  Warnings:

  - You are about to drop the column `topic` on the `ClassAssignments` table. All the data in the column will be lost.
  - You are about to drop the column `topic` on the `ClassQuiz` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "public"."ClassAssignments_topic_key";

-- DropIndex
DROP INDEX "public"."ClassQuiz_topic_key";

-- AlterTable
ALTER TABLE "public"."ClassAssignments" DROP COLUMN "topic";

-- AlterTable
ALTER TABLE "public"."ClassQuiz" DROP COLUMN "topic";

-- CreateTable
CREATE TABLE "public"."ClassTopic" (
    "topic_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "class_id" TEXT NOT NULL,
    "assignments_id" TEXT,
    "quiz_id" TEXT,

    CONSTRAINT "ClassTopic_pkey" PRIMARY KEY ("topic_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ClassTopic_topic_id_key" ON "public"."ClassTopic"("topic_id");

-- CreateIndex
CREATE UNIQUE INDEX "ClassTopic_assignments_id_key" ON "public"."ClassTopic"("assignments_id");

-- CreateIndex
CREATE UNIQUE INDEX "ClassTopic_quiz_id_key" ON "public"."ClassTopic"("quiz_id");

-- AddForeignKey
ALTER TABLE "public"."ClassTopic" ADD CONSTRAINT "ClassTopic_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "public"."Class"("class_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ClassTopic" ADD CONSTRAINT "ClassTopic_assignments_id_fkey" FOREIGN KEY ("assignments_id") REFERENCES "public"."ClassAssignments"("assignments_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ClassTopic" ADD CONSTRAINT "ClassTopic_quiz_id_fkey" FOREIGN KEY ("quiz_id") REFERENCES "public"."ClassQuiz"("quiz_id") ON DELETE SET NULL ON UPDATE CASCADE;
