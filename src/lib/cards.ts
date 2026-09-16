"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { randomBytes } from "crypto";

export interface CreateCardState {
  error: string | null;
  success: boolean;
}

export async function createCard(
  _prevState: CreateCardState,
  formData: FormData,
): Promise<CreateCardState> {
  const recipientName = formData.get("recipientName")?.toString().trim();
  const recipientPhoto = formData.get("recipientPhoto")?.toString().trim();
  const passcode = formData.get("passcode")?.toString().trim();

  if (!recipientName) {
    return { error: "Recipient name is required.", success: false };
  }
  if (!recipientPhoto) {
    return {
      error: "Upload a recipient photo before creating the card.",
      success: false,
    };
  }
  if (!passcode) {
    return { error: "Passcode is required.", success: false };
  }

  try {
    await prisma.card.create({
      data: { recipientName, recipientPhoto, passcode },
    });
  } catch (err) {
    console.error("Failed to create card:", err);
    return {
      error: "Something went wrong creating the card. Try again.",
      success: false,
    };
  }

  revalidatePath("/admin");
  return { error: null, success: true };
}

export async function updateCard(
  cardId: string,
  data: { recipientName: string; recipientPhoto: string },
): Promise<void> {
  await prisma.card.update({
    where: { id: cardId },
    data: {
      recipientName: data.recipientName,
      recipientPhoto: data.recipientPhoto,
    },
  });

  revalidatePath(`/admin/cards/${cardId}`);
  revalidatePath("/admin");
}

export async function deleteCard(cardId: string): Promise<void> {
  await prisma.card.delete({ where: { id: cardId } });
  revalidatePath("/admin");
  redirect("/admin");
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function generateViewSlug(recipientName: string): string {
  const base = slugify(recipientName) || "card";
  const suffix = randomBytes(4).toString("hex");
  return `${base}-${suffix}`;
}

export async function closeCard(cardId: string): Promise<{ viewSlug: string }> {
  const card = await prisma.card.findUnique({ where: { id: cardId } });
  if (!card) throw new Error("Card not found.");

  if (card.isClosed && card.viewSlug) {
    return { viewSlug: card.viewSlug };
  }

  let viewSlug = generateViewSlug(card.recipientName);

  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      await prisma.card.update({
        where: { id: cardId },
        data: { isClosed: true, viewSlug },
      });
      break;
    } catch (err) {
      if (attempt === 4) throw err;
      viewSlug = generateViewSlug(card.recipientName); // retry on rare slug collision
    }
  }

  revalidatePath(`/admin/cards/${cardId}`);
  revalidatePath("/admin");
  return { viewSlug };
}
