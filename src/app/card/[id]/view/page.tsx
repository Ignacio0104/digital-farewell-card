import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import LetterView from "@/app/components/view/LetterView";

interface ViewPageProps {
  params: Promise<{ id: string }>;
}

export default async function ViewPage({ params }: ViewPageProps) {
  const { id } = await params;

  const card = await prisma.card.findUnique({
    where: { viewSlug: id },
    include: { messages: { orderBy: { createdAt: "asc" } } },
  });

  if (!card || !card.isClosed) notFound();

  return (
    <LetterView
      recipientName={card.recipientName}
      recipientPhoto={card.recipientPhoto}
      messages={card.messages.map((m) => ({
        id: m.id,
        authorName: m.authorName,
        messageText: m.messageText,
        images: m.images,
      }))}
    />
  );
}
