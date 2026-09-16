import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import SubmissionGate from "@/app/components/submit/SubmissionGate";

interface SubmitPageProps {
  params: Promise<{ id: string }>;
}

export default async function SubmitPage({ params }: SubmitPageProps) {
  const { id } = await params;

  console.log(id);

  const card = await prisma.card.findUnique({
    where: { passcode: id },
    select: { id: true, recipientName: true, isClosed: true },
  });

  if (!card) notFound();

  if (card.isClosed) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#FBFAF7] px-6">
        <div className="max-w-sm text-center">
          <h1 className="font-serif text-2xl text-[#23262B]">
            Submissions are closed
          </h1>
          <p className="mt-2 text-sm text-[#7A756B]">
            The card for {card.recipientName} is no longer accepting new
            messages.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#FBFAF7] px-6 py-12">
      <SubmissionGate cardId={card.id} recipientName={card.recipientName} />
    </main>
  );
}
