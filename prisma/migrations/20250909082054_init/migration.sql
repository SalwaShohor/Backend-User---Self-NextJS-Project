/*
  Warnings:

  - A unique constraint covering the columns `[credentialID]` on the table `credentials` will be added. If there are existing duplicate values, this will fail.
  - Made the column `counter` on table `credentials` required. This step will fail if there are existing NULL values in that column.
  - Made the column `user_id` on table `credentials` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."credentials" ALTER COLUMN "counter" SET NOT NULL,
ALTER COLUMN "user_id" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "credentials_credentialID_key" ON "public"."credentials"("credentialID");
