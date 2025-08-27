/*
  Warnings:

  - A unique constraint covering the columns `[file_id]` on the table `File` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `Invitation` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[answer_id]` on the table `QuizAnswer` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[option_id]` on the table `QuizOption` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE "public"."PrivateChat" (
    "chat_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_message_at" TIMESTAMP(3),

    CONSTRAINT "PrivateChat_pkey" PRIMARY KEY ("chat_id")
);

-- CreateTable
CREATE TABLE "public"."PrivateChatUser" (
    "id" TEXT NOT NULL,
    "chat_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "PrivateChatUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PrivateMessage" (
    "message_id" TEXT NOT NULL,
    "chat_id" TEXT NOT NULL,
    "sender_id" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "read_at" TIMESTAMP(3),

    CONSTRAINT "PrivateMessage_pkey" PRIMARY KEY ("message_id")
);

-- CreateTable
CREATE TABLE "public"."GroupChat" (
    "group_chat_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_message_at" TIMESTAMP(3),

    CONSTRAINT "GroupChat_pkey" PRIMARY KEY ("group_chat_id")
);

-- CreateTable
CREATE TABLE "public"."GroupChatUser" (
    "id" TEXT NOT NULL,
    "group_chat_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "GroupChatUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."GroupMessage" (
    "id" TEXT NOT NULL,
    "group_chat_id" TEXT NOT NULL,
    "sender_id" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "read_at" TIMESTAMP(3),

    CONSTRAINT "GroupMessage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PrivateChat_chat_id_key" ON "public"."PrivateChat"("chat_id");

-- CreateIndex
CREATE UNIQUE INDEX "PrivateChatUser_id_key" ON "public"."PrivateChatUser"("id");

-- CreateIndex
CREATE UNIQUE INDEX "PrivateChatUser_chat_id_user_id_key" ON "public"."PrivateChatUser"("chat_id", "user_id");

-- CreateIndex
CREATE UNIQUE INDEX "PrivateMessage_message_id_key" ON "public"."PrivateMessage"("message_id");

-- CreateIndex
CREATE UNIQUE INDEX "GroupChat_group_chat_id_key" ON "public"."GroupChat"("group_chat_id");

-- CreateIndex
CREATE UNIQUE INDEX "GroupChatUser_id_key" ON "public"."GroupChatUser"("id");

-- CreateIndex
CREATE UNIQUE INDEX "GroupChatUser_group_chat_id_user_id_key" ON "public"."GroupChatUser"("group_chat_id", "user_id");

-- CreateIndex
CREATE UNIQUE INDEX "GroupMessage_id_key" ON "public"."GroupMessage"("id");

-- CreateIndex
CREATE UNIQUE INDEX "File_file_id_key" ON "public"."File"("file_id");

-- CreateIndex
CREATE UNIQUE INDEX "Invitation_id_key" ON "public"."Invitation"("id");

-- CreateIndex
CREATE UNIQUE INDEX "QuizAnswer_answer_id_key" ON "public"."QuizAnswer"("answer_id");

-- CreateIndex
CREATE UNIQUE INDEX "QuizOption_option_id_key" ON "public"."QuizOption"("option_id");

-- AddForeignKey
ALTER TABLE "public"."PrivateChatUser" ADD CONSTRAINT "PrivateChatUser_chat_id_fkey" FOREIGN KEY ("chat_id") REFERENCES "public"."PrivateChat"("chat_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PrivateChatUser" ADD CONSTRAINT "PrivateChatUser_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PrivateMessage" ADD CONSTRAINT "PrivateMessage_chat_id_fkey" FOREIGN KEY ("chat_id") REFERENCES "public"."PrivateChat"("chat_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PrivateMessage" ADD CONSTRAINT "PrivateMessage_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "public"."User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."GroupChatUser" ADD CONSTRAINT "GroupChatUser_group_chat_id_fkey" FOREIGN KEY ("group_chat_id") REFERENCES "public"."GroupChat"("group_chat_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."GroupChatUser" ADD CONSTRAINT "GroupChatUser_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."GroupMessage" ADD CONSTRAINT "GroupMessage_group_chat_id_fkey" FOREIGN KEY ("group_chat_id") REFERENCES "public"."GroupChat"("group_chat_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."GroupMessage" ADD CONSTRAINT "GroupMessage_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "public"."User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
