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

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#FBFAF7] px-6 py-12">
      <SubmissionGate cardId={card.id} recipientName={card.recipientName} />
    </main>
  );
}
