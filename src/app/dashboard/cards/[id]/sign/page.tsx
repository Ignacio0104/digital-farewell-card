import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import SignForm from "@/app/components/dashboard/SignForm";

interface SignPageProps {
  params: Promise<{ id: string }>;
}

export default async function SignPage({ params }: SignPageProps) {
  const { id } = await params;

  const session = await auth();
  const email = session?.user?.email?.toLowerCase();
  if (!email) redirect(`/login?callbackUrl=/dashboard/cards/${id}/sign`);

  const card = await prisma.card.findUnique({
    where: { id },
    select: {
      id: true,
      recipientName: true,
      messages: { where: { ownerEmail: email }, select: { id: true } },
    },
  });

  if (!card) notFound();
  if (card.messages.length > 0) redirect("/dashboard");

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#FBFAF7] px-6 py-12">
      <SignForm
        cardId={card.id}
        recipientName={card.recipientName}
        defaultName={session?.user?.name ?? ""}
      />
    </main>
  );
}
