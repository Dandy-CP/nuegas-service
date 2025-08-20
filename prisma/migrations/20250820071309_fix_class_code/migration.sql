/*
  Warnings:

  - Made the column `description` on table `Class` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."Class" ALTER COLUMN "description" SET NOT NULL;
