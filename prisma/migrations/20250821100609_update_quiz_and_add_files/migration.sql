/*
  Warnings:

  - You are about to drop the column `answer` on the `QuizContent` table. All the data in the column will be lost.
  - You are about to drop the column `right_answer` on the `QuizContent` table. All the data in the column will be lost.
  - You are about to drop the column `answer` on the `QuizResult` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."QuizContent" DROP COLUMN "answer",
DROP COLUMN "right_answer",
ADD COLUMN     "attachment" TEXT[];

-- AlterTable
ALTER TABLE "public"."QuizResult" DROP COLUMN "answer";

-- CreateTable
CREATE TABLE "public"."QuizOption" (
    "option_id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "is_correct" BOOLEAN NOT NULL DEFAULT false,
    "quiz_content_id" TEXT NOT NULL,

    CONSTRAINT "QuizOption_pkey" PRIMARY KEY ("option_id")
);

-- CreateTable
CREATE TABLE "public"."QuizAnswer" (
    "answer_id" TEXT NOT NULL,
    "quiz_content_id" TEXT NOT NULL,
    "option_id" TEXT NOT NULL,
    "result_id" TEXT NOT NULL,

    CONSTRAINT "QuizAnswer_pkey" PRIMARY KEY ("answer_id")
);

-- CreateTable
CREATE TABLE "public"."File" (
    "file_id" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "mimetype" TEXT,
    "size" INTEGER,
    "uploaded_by" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "File_pkey" PRIMARY KEY ("file_id")
);

-- AddForeignKey
ALTER TABLE "public"."QuizOption" ADD CONSTRAINT "QuizOption_quiz_content_id_fkey" FOREIGN KEY ("quiz_content_id") REFERENCES "public"."QuizContent"("quiz_content_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."QuizAnswer" ADD CONSTRAINT "QuizAnswer_quiz_content_id_fkey" FOREIGN KEY ("quiz_content_id") REFERENCES "public"."QuizContent"("quiz_content_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."QuizAnswer" ADD CONSTRAINT "QuizAnswer_option_id_fkey" FOREIGN KEY ("option_id") REFERENCES "public"."QuizOption"("option_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."QuizAnswer" ADD CONSTRAINT "QuizAnswer_result_id_fkey" FOREIGN KEY ("result_id") REFERENCES "public"."QuizResult"("result_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."File" ADD CONSTRAINT "File_uploaded_by_fkey" FOREIGN KEY ("uploaded_by") REFERENCES "public"."User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
