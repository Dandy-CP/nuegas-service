-- CreateTable
CREATE TABLE "public"."User" (
    "user_id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "profile_image" TEXT NOT NULL,
    "totp_secret" TEXT NOT NULL,
    "is_2fa_active" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "public"."Class" (
    "class_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "class_code" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "owner_user_id" TEXT NOT NULL,

    CONSTRAINT "Class_pkey" PRIMARY KEY ("class_id")
);

-- CreateTable
CREATE TABLE "public"."Comment" (
    "comment_id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "user_id" TEXT NOT NULL,
    "post_id" TEXT,
    "assignments_id" TEXT,
    "assignments_result_id" TEXT,
    "quiz_id" TEXT,
    "quiz_result_id" TEXT,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("comment_id")
);

-- CreateTable
CREATE TABLE "public"."ClassMember" (
    "class_member_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "user_id" TEXT NOT NULL,
    "class_code" TEXT NOT NULL,

    CONSTRAINT "ClassMember_pkey" PRIMARY KEY ("class_member_id")
);

-- CreateTable
CREATE TABLE "public"."ClassPost" (
    "post_id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "attachment" TEXT[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "class_id" TEXT NOT NULL,

    CONSTRAINT "ClassPost_pkey" PRIMARY KEY ("post_id")
);

-- CreateTable
CREATE TABLE "public"."ClassAssignments" (
    "assignments_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "attachment" TEXT[],
    "start_date" TIMESTAMP(3) NOT NULL,
    "due_date" TIMESTAMP(3) NOT NULL,
    "is_available" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "class_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "ClassAssignments_pkey" PRIMARY KEY ("assignments_id")
);

-- CreateTable
CREATE TABLE "public"."SubmissionResult" (
    "result_id" TEXT NOT NULL,
    "attachment" TEXT[],
    "point" INTEGER NOT NULL DEFAULT 0,
    "submited_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "assignments_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "SubmissionResult_pkey" PRIMARY KEY ("result_id")
);

-- CreateTable
CREATE TABLE "public"."ClassQuiz" (
    "quiz_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "attachment" TEXT[],
    "start_date" TIMESTAMP(3) NOT NULL,
    "due_date" TIMESTAMP(3) NOT NULL,
    "is_available" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "class_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "ClassQuiz_pkey" PRIMARY KEY ("quiz_id")
);

-- CreateTable
CREATE TABLE "public"."QuizContent" (
    "quiz_content_id" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "answer" JSONB,
    "right_answer" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "quiz_id" TEXT NOT NULL,

    CONSTRAINT "QuizContent_pkey" PRIMARY KEY ("quiz_content_id")
);

-- CreateTable
CREATE TABLE "public"."QuizResult" (
    "result_id" TEXT NOT NULL,
    "answer" JSONB,
    "point" INTEGER NOT NULL DEFAULT 0,
    "submited_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "quiz_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "QuizResult_pkey" PRIMARY KEY ("result_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_user_id_key" ON "public"."User"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Class_class_id_key" ON "public"."Class"("class_id");

-- CreateIndex
CREATE UNIQUE INDEX "Class_class_code_key" ON "public"."Class"("class_code");

-- CreateIndex
CREATE UNIQUE INDEX "Comment_comment_id_key" ON "public"."Comment"("comment_id");

-- CreateIndex
CREATE UNIQUE INDEX "ClassMember_class_member_id_key" ON "public"."ClassMember"("class_member_id");

-- CreateIndex
CREATE INDEX "ClassMember_user_id_class_code_idx" ON "public"."ClassMember"("user_id", "class_code");

-- CreateIndex
CREATE UNIQUE INDEX "ClassMember_user_id_class_code_key" ON "public"."ClassMember"("user_id", "class_code");

-- CreateIndex
CREATE UNIQUE INDEX "ClassPost_post_id_key" ON "public"."ClassPost"("post_id");

-- CreateIndex
CREATE UNIQUE INDEX "ClassAssignments_assignments_id_key" ON "public"."ClassAssignments"("assignments_id");

-- CreateIndex
CREATE UNIQUE INDEX "ClassAssignments_topic_key" ON "public"."ClassAssignments"("topic");

-- CreateIndex
CREATE UNIQUE INDEX "SubmissionResult_result_id_key" ON "public"."SubmissionResult"("result_id");

-- CreateIndex
CREATE INDEX "SubmissionResult_user_id_assignments_id_idx" ON "public"."SubmissionResult"("user_id", "assignments_id");

-- CreateIndex
CREATE UNIQUE INDEX "SubmissionResult_user_id_assignments_id_key" ON "public"."SubmissionResult"("user_id", "assignments_id");

-- CreateIndex
CREATE UNIQUE INDEX "ClassQuiz_quiz_id_key" ON "public"."ClassQuiz"("quiz_id");

-- CreateIndex
CREATE UNIQUE INDEX "ClassQuiz_topic_key" ON "public"."ClassQuiz"("topic");

-- CreateIndex
CREATE UNIQUE INDEX "QuizContent_quiz_content_id_key" ON "public"."QuizContent"("quiz_content_id");

-- CreateIndex
CREATE UNIQUE INDEX "QuizResult_result_id_key" ON "public"."QuizResult"("result_id");

-- CreateIndex
CREATE INDEX "QuizResult_user_id_quiz_id_idx" ON "public"."QuizResult"("user_id", "quiz_id");

-- CreateIndex
CREATE UNIQUE INDEX "QuizResult_user_id_quiz_id_key" ON "public"."QuizResult"("user_id", "quiz_id");

-- AddForeignKey
ALTER TABLE "public"."Class" ADD CONSTRAINT "Class_owner_user_id_fkey" FOREIGN KEY ("owner_user_id") REFERENCES "public"."User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Comment" ADD CONSTRAINT "Comment_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Comment" ADD CONSTRAINT "Comment_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "public"."ClassPost"("post_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Comment" ADD CONSTRAINT "Comment_assignments_id_fkey" FOREIGN KEY ("assignments_id") REFERENCES "public"."ClassAssignments"("assignments_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Comment" ADD CONSTRAINT "Comment_assignments_result_id_fkey" FOREIGN KEY ("assignments_result_id") REFERENCES "public"."SubmissionResult"("result_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Comment" ADD CONSTRAINT "Comment_quiz_id_fkey" FOREIGN KEY ("quiz_id") REFERENCES "public"."ClassQuiz"("quiz_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Comment" ADD CONSTRAINT "Comment_quiz_result_id_fkey" FOREIGN KEY ("quiz_result_id") REFERENCES "public"."QuizResult"("result_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ClassMember" ADD CONSTRAINT "ClassMember_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ClassMember" ADD CONSTRAINT "ClassMember_class_code_fkey" FOREIGN KEY ("class_code") REFERENCES "public"."Class"("class_code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ClassPost" ADD CONSTRAINT "ClassPost_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "public"."Class"("class_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ClassAssignments" ADD CONSTRAINT "ClassAssignments_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "public"."Class"("class_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ClassAssignments" ADD CONSTRAINT "ClassAssignments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SubmissionResult" ADD CONSTRAINT "SubmissionResult_assignments_id_fkey" FOREIGN KEY ("assignments_id") REFERENCES "public"."ClassAssignments"("assignments_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SubmissionResult" ADD CONSTRAINT "SubmissionResult_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ClassQuiz" ADD CONSTRAINT "ClassQuiz_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "public"."Class"("class_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ClassQuiz" ADD CONSTRAINT "ClassQuiz_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."QuizContent" ADD CONSTRAINT "QuizContent_quiz_id_fkey" FOREIGN KEY ("quiz_id") REFERENCES "public"."ClassQuiz"("quiz_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."QuizResult" ADD CONSTRAINT "QuizResult_quiz_id_fkey" FOREIGN KEY ("quiz_id") REFERENCES "public"."ClassQuiz"("quiz_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."QuizResult" ADD CONSTRAINT "QuizResult_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
