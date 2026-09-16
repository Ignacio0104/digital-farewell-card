/*
  Warnings:

  - A unique constraint covering the columns `[passcode]` on the table `Card` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Card_passcode_key" ON "Card"("passcode");
