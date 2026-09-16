"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function deleteMessage(
  messageId: string,
  cardId: string,
): Promise<void> {
  await prisma.message.delete({ where: { id: messageId } });
  revalidatePath(`/admin/cards/${cardId}`);
}

export interface VerifyPasscodeResult {
  ok: boolean;
  error?: string;
}

export async function verifyPasscode(
  cardId: string,
  passcode: string,
): Promise<VerifyPasscodeResult> {
  const card = await prisma.card.findUnique({ where: { id: cardId } });

  if (!card) return { ok: false, error: "Card not found." };
  if (card.isClosed)
    return { ok: false, error: "Submissions are closed for this card." };
  console.log(card);
  if (card.passcode !== passcode.trim())
    return { ok: false, error: "Incorrect passcode." };

  return { ok: true };
}

export interface SubmitMessageState {
  error: string | null;
  success: boolean;
}

export async function submitMessage(
  cardId: string,
  data: {
    authorName: string;
    messageText: string;
    images: string[];
    passcode: string;
  },
): Promise<SubmitMessageState> {
  // Re-verify server-side rather than trusting the client's unlocked state.
  const card = await prisma.card.findUnique({ where: { id: cardId } });
  console.log(data);
  if (!card) return { error: "Card not found.", success: false };
  if (card.isClosed)
    return { error: "Submissions are closed for this card.", success: false };
  if (card.passcode !== data.passcode.trim()) {
    console.log("Hereee");
    return { error: "Incorrect passcode.", success: false };
  }

  const authorName = data.authorName.trim();
  const messageText = data.messageText.trim();

  if (!authorName) return { error: "Your name is required.", success: false };
  if (!messageText) return { error: "A message is required.", success: false };
  if (data.images.length > 3)
    return { error: "You can attach up to 3 photos.", success: false };

  try {
    await prisma.message.create({
      data: { cardId, authorName, messageText, images: data.images },
    });
  } catch (err) {
    console.error("Failed to submit message:", err);
    return {
      error: "Something went wrong submitting your message.",
      success: false,
    };
  }

  revalidatePath(`/admin/cards/${cardId}`);
  return { error: null, success: true };
}
