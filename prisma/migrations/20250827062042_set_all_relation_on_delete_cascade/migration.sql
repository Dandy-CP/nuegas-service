/*
  Warnings:

  - Added the required column `class_id` to the `GroupChat` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Class" DROP CONSTRAINT "Class_owner_user_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."ClassAssignments" DROP CONSTRAINT "ClassAssignments_class_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."ClassAssignments" DROP CONSTRAINT "ClassAssignments_topic_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."ClassAssignments" DROP CONSTRAINT "ClassAssignments_user_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."ClassMember" DROP CONSTRAINT "ClassMember_class_code_fkey";

-- DropForeignKey
ALTER TABLE "public"."ClassMember" DROP CONSTRAINT "ClassMember_user_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."ClassPost" DROP CONSTRAINT "ClassPost_class_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."ClassPost" DROP CONSTRAINT "ClassPost_user_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."ClassQuiz" DROP CONSTRAINT "ClassQuiz_class_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."ClassQuiz" DROP CONSTRAINT "ClassQuiz_topic_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."ClassQuiz" DROP CONSTRAINT "ClassQuiz_user_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."ClassTopic" DROP CONSTRAINT "ClassTopic_class_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."GroupChatUser" DROP CONSTRAINT "GroupChatUser_group_chat_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."GroupChatUser" DROP CONSTRAINT "GroupChatUser_user_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."GroupMessage" DROP CONSTRAINT "GroupMessage_group_chat_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."GroupMessage" DROP CONSTRAINT "GroupMessage_sender_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."Invitation" DROP CONSTRAINT "Invitation_class_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."PrivateChatUser" DROP CONSTRAINT "PrivateChatUser_chat_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."PrivateChatUser" DROP CONSTRAINT "PrivateChatUser_user_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."PrivateMessage" DROP CONSTRAINT "PrivateMessage_chat_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."PrivateMessage" DROP CONSTRAINT "PrivateMessage_sender_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."QuizResult" DROP CONSTRAINT "QuizResult_user_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."SubmissionResult" DROP CONSTRAINT "SubmissionResult_assignments_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."SubmissionResult" DROP CONSTRAINT "SubmissionResult_user_id_fkey";

-- AlterTable
ALTER TABLE "public"."GroupChat" ADD COLUMN     "class_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."Class" ADD CONSTRAINT "Class_owner_user_id_fkey" FOREIGN KEY ("owner_user_id") REFERENCES "public"."User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ClassTopic" ADD CONSTRAINT "ClassTopic_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "public"."Class"("class_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ClassMember" ADD CONSTRAINT "ClassMember_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ClassMember" ADD CONSTRAINT "ClassMember_class_code_fkey" FOREIGN KEY ("class_code") REFERENCES "public"."Class"("class_code") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ClassPost" ADD CONSTRAINT "ClassPost_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "public"."Class"("class_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ClassPost" ADD CONSTRAINT "ClassPost_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ClassAssignments" ADD CONSTRAINT "ClassAssignments_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "public"."Class"("class_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ClassAssignments" ADD CONSTRAINT "ClassAssignments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ClassAssignments" ADD CONSTRAINT "ClassAssignments_topic_id_fkey" FOREIGN KEY ("topic_id") REFERENCES "public"."ClassTopic"("topic_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SubmissionResult" ADD CONSTRAINT "SubmissionResult_assignments_id_fkey" FOREIGN KEY ("assignments_id") REFERENCES "public"."ClassAssignments"("assignments_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SubmissionResult" ADD CONSTRAINT "SubmissionResult_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ClassQuiz" ADD CONSTRAINT "ClassQuiz_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "public"."Class"("class_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ClassQuiz" ADD CONSTRAINT "ClassQuiz_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ClassQuiz" ADD CONSTRAINT "ClassQuiz_topic_id_fkey" FOREIGN KEY ("topic_id") REFERENCES "public"."ClassTopic"("topic_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."QuizResult" ADD CONSTRAINT "QuizResult_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Invitation" ADD CONSTRAINT "Invitation_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "public"."Class"("class_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PrivateChatUser" ADD CONSTRAINT "PrivateChatUser_chat_id_fkey" FOREIGN KEY ("chat_id") REFERENCES "public"."PrivateChat"("chat_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PrivateChatUser" ADD CONSTRAINT "PrivateChatUser_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PrivateMessage" ADD CONSTRAINT "PrivateMessage_chat_id_fkey" FOREIGN KEY ("chat_id") REFERENCES "public"."PrivateChat"("chat_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PrivateMessage" ADD CONSTRAINT "PrivateMessage_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "public"."User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."GroupChat" ADD CONSTRAINT "GroupChat_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "public"."Class"("class_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."GroupChatUser" ADD CONSTRAINT "GroupChatUser_group_chat_id_fkey" FOREIGN KEY ("group_chat_id") REFERENCES "public"."GroupChat"("group_chat_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."GroupChatUser" ADD CONSTRAINT "GroupChatUser_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."GroupMessage" ADD CONSTRAINT "GroupMessage_group_chat_id_fkey" FOREIGN KEY ("group_chat_id") REFERENCES "public"."GroupChat"("group_chat_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."GroupMessage" ADD CONSTRAINT "GroupMessage_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "public"."User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;
