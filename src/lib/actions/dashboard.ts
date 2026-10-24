"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

const CLOUDINARY_PREFIX = "https://res.cloudinary.com/";

async function currentEmail(): Promise<string> {
  const session = await auth();
  const email = session?.user?.email?.toLowerCase();
  if (!email) throw new Error("Unauthorized");
  return email;
}

export async function claimMessage(
  messageId: string,
): Promise<{ error: string | null }> {
  const email = await currentEmail();

  try {
    const result = await prisma.message.updateMany({
      where: { id: messageId, ownerEmail: null },
      data: { ownerEmail: email },
    });
    if (result.count === 0) return { error: "Este mensaje ya fue reclamado." };
  } catch (err) {
    console.error("claimMessage failed:", err);
    return { error: "Ya tenés un mensaje en esta card." };
  }

  revalidatePath("/dashboard");
  return { error: null };
}

export async function updateMyMessage(
  messageId: string,
  data: { authorName: string; messageText: string; images: string[] },
): Promise<{ error: string | null }> {
  const email = await currentEmail();

  const authorName = data.authorName.trim();
  const messageText = data.messageText.trim();

  if (!authorName) return { error: "El nombre es obligatorio." };
  if (!messageText) return { error: "El mensaje es obligatorio." };
  if (data.images.length > 3) return { error: "Máximo 3 fotos." };
  if (data.images.some((url) => !url.startsWith(CLOUDINARY_PREFIX))) {
    return { error: "Foto inválida." };
  }

  const result = await prisma.message.updateMany({
    where: { id: messageId, ownerEmail: email },
    data: { authorName, messageText, images: data.images },
  });
  if (result.count === 0) return { error: "No podés editar este mensaje." };

  const message = await prisma.message.findUnique({
    where: { id: messageId },
    include: { card: true },
  });

  revalidatePath("/dashboard");
  if (message?.card.viewSlug)
    revalidatePath(`/card/${message.card.viewSlug}/view`);

  return { error: null };
}

export async function searchUnclaimedMessages(
  cardId: string,
  query: string,
): Promise<{ id: string; authorName: string }[]> {
  await currentEmail(); // exige sesión iniciada

  const q = query.trim();
  if (q.length < 2) return [];

  return prisma.message.findMany({
    where: {
      cardId,
      ownerEmail: null,
      authorName: { contains: q, mode: "insensitive" },
    },
    select: { id: true, authorName: true },
    orderBy: { createdAt: "asc" },
    take: 5,
  });
}

export async function submitMyMessage(
  cardId: string,
  data: { authorName: string; messageText: string; images: string[] },
): Promise<{ error: string | null }> {
  const email = await currentEmail();

  const authorName = data.authorName.trim();
  const messageText = data.messageText.trim();

  if (!authorName) return { error: "El nombre es obligatorio." };
  if (!messageText) return { error: "El mensaje es obligatorio." };
  if (data.images.length > 3) return { error: "Máximo 3 fotos." };
  if (data.images.some((url) => !url.startsWith(CLOUDINARY_PREFIX))) {
    return { error: "Foto inválida." };
  }

  const card = await prisma.card.findUnique({
    where: { id: cardId },
    select: { id: true, viewSlug: true },
  });
  if (!card) return { error: "Card no encontrada." };

  try {
    await prisma.message.create({
      data: {
        cardId,
        authorName,
        messageText,
        images: data.images,
        ownerEmail: email,
      },
    });
  } catch (err) {
    console.error("submitMyMessage failed:", err);
    return { error: "Ya firmaste esta card." };
  }

  revalidatePath("/dashboard");
  revalidatePath(`/admin/cards/${cardId}`);
  if (card.viewSlug) revalidatePath(`/card/${card.viewSlug}/view`);

  return { error: null };
}
