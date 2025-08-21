-- DropForeignKey
ALTER TABLE "public"."QuizAnswer" DROP CONSTRAINT "QuizAnswer_option_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."QuizAnswer" DROP CONSTRAINT "QuizAnswer_quiz_content_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."QuizAnswer" DROP CONSTRAINT "QuizAnswer_result_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."QuizContent" DROP CONSTRAINT "QuizContent_quiz_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."QuizOption" DROP CONSTRAINT "QuizOption_quiz_content_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."QuizResult" DROP CONSTRAINT "QuizResult_quiz_id_fkey";

-- AddForeignKey
ALTER TABLE "public"."QuizContent" ADD CONSTRAINT "QuizContent_quiz_id_fkey" FOREIGN KEY ("quiz_id") REFERENCES "public"."ClassQuiz"("quiz_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."QuizOption" ADD CONSTRAINT "QuizOption_quiz_content_id_fkey" FOREIGN KEY ("quiz_content_id") REFERENCES "public"."QuizContent"("quiz_content_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."QuizResult" ADD CONSTRAINT "QuizResult_quiz_id_fkey" FOREIGN KEY ("quiz_id") REFERENCES "public"."ClassQuiz"("quiz_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."QuizAnswer" ADD CONSTRAINT "QuizAnswer_quiz_content_id_fkey" FOREIGN KEY ("quiz_content_id") REFERENCES "public"."QuizContent"("quiz_content_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."QuizAnswer" ADD CONSTRAINT "QuizAnswer_option_id_fkey" FOREIGN KEY ("option_id") REFERENCES "public"."QuizOption"("option_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."QuizAnswer" ADD CONSTRAINT "QuizAnswer_result_id_fkey" FOREIGN KEY ("result_id") REFERENCES "public"."QuizResult"("result_id") ON DELETE CASCADE ON UPDATE CASCADE;
