-- CreateTable
CREATE TABLE "Card" (
    "id" TEXT NOT NULL,
    "recipientName" TEXT NOT NULL,
    "recipientPhoto" TEXT NOT NULL,
    "passcode" TEXT NOT NULL,
    "isClosed" BOOLEAN NOT NULL DEFAULT false,
    "viewSlug" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Card_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" TEXT NOT NULL,
    "cardId" TEXT NOT NULL,
    "authorName" TEXT NOT NULL,
    "messageText" TEXT NOT NULL,
    "images" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Card_viewSlug_key" ON "Card"("viewSlug");

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "Card"("id") ON DELETE CASCADE ON UPDATE CASCADE;
