/*
  Warnings:

  - A unique constraint covering the columns `[cardId,ownerEmail]` on the table `Message` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "ownerEmail" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Message_cardId_ownerEmail_key" ON "Message"("cardId", "ownerEmail");
