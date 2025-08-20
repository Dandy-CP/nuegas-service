-- AlterTable
ALTER TABLE "public"."Class" ALTER COLUMN "description" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."ClassAssignments" ALTER COLUMN "topic" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."ClassQuiz" ALTER COLUMN "description" DROP NOT NULL,
ALTER COLUMN "topic" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."User" ALTER COLUMN "profile_image" DROP NOT NULL,
ALTER COLUMN "totp_secret" DROP NOT NULL;
