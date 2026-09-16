import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import EditCardForm from "../../../components/admin/EditCardForm";
import MessagesList from "../../../components/admin/MessagesList";

interface ManageCardPageProps {
  params: Promise<{ id: string }>;
}

export default async function ManageCardPage({ params }: ManageCardPageProps) {
  const { id } = await params;

  const card = await prisma.card.findUnique({
    where: { id },
    include: { messages: { orderBy: { createdAt: "desc" } } },
  });

  if (!card) notFound();

  return (
    <main className="min-h-screen bg-[#FBFAF7] px-6 py-12 sm:px-12">
      <div className="mx-auto max-w-3xl">
        <a href="/admin" className="text-sm text-[#7A5C61] hover:underline">
          ← All cards
        </a>

        <h1 className="mt-4 font-serif text-3xl text-[#23262B]">
          {card.recipientName}
        </h1>

        <section className="mt-8">
          <EditCardForm
            card={{
              id: card.id,
              recipientName: card.recipientName,
              recipientPhoto: card.recipientPhoto,
              isClosed: card.isClosed,
              viewSlug: card.viewSlug,
            }}
          />
        </section>

        <section className="mt-12">
          <h2 className="font-serif text-xl text-[#23262B]">
            Messages ({card.messages.length})
          </h2>
          <div className="mt-4">
            <MessagesList
              cardId={card.id}
              messages={card.messages.map((m) => ({
                id: m.id,
                authorName: m.authorName,
                messageText: m.messageText,
                images: m.images,
                createdAt: m.createdAt.toISOString(),
              }))}
            />
          </div>
        </section>
      </div>
    </main>
  );
}
