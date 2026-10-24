import Link from "next/link";
import { redirect } from "next/navigation";
import { auth, signOut } from "@/auth";
import { prisma } from "@/lib/prisma";
import { isAdminEmail } from "@/lib/admin";
import DashboardCardItem, {
  DashboardCard,
} from "../components/dashboard/DashboardCardItem";

export default async function DashboardPage() {
  const session = await auth();
  const email = session?.user?.email?.toLowerCase();
  if (!email) redirect("/login?callbackUrl=/dashboard");

  const cards = await prisma.card.findMany({
    orderBy: { createdAt: "desc" },
    include: { messages: { where: { ownerEmail: email } } },
  });

  const items: DashboardCard[] = cards.map((card) => {
    const mine = card.messages[0] ?? null;

    return {
      id: card.id,
      recipientName: card.recipientName,
      recipientPhoto: card.recipientPhoto,
      mine: mine
        ? {
            id: mine.id,
            authorName: mine.authorName,
            messageText: mine.messageText,
            images: mine.images,
          }
        : null,
    };
  });

  const pending = items.filter((c) => !c.mine);
  const signed = items.filter((c) => c.mine);

  return (
    <main className="min-h-screen bg-[#FBFAF7] px-6 py-12 sm:px-12">
      <div className="mx-auto max-w-2xl">
        <div className="flex items-center justify-between">
          <h1 className="font-serif text-3xl text-[#23262B]">Mis cards</h1>
          <div className="flex items-center gap-4 text-sm">
            {isAdminEmail(email) && (
              <Link href="/admin" className="text-[#7A5C61] hover:underline">
                Admin
              </Link>
            )}
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/login" });
              }}
            >
              <button
                type="submit"
                className="text-[#7A756B] hover:text-[#23262B]"
              >
                Salir
              </button>
            </form>
          </div>
        </div>
        <p className="mt-1 text-sm text-[#7A756B]">{email}</p>

        <section className="mt-10">
          <h2 className="font-serif text-xl text-[#23262B]">
            Pendientes ({pending.length})
          </h2>
          {pending.length === 0 ? (
            <p className="mt-3 text-sm text-[#7A756B]">
              Firmaste todas las cards. 🎉
            </p>
          ) : (
            <ul className="mt-2 border-t border-[#E4E0D9]">
              {pending.map((card) => (
                <DashboardCardItem key={card.id} card={card} />
              ))}
            </ul>
          )}
        </section>

        <section className="mt-12">
          <h2 className="font-serif text-xl text-[#23262B]">
            Firmadas ({signed.length})
          </h2>
          {signed.length === 0 ? (
            <p className="mt-3 text-sm text-[#7A756B]">
              Todavía no firmaste ninguna.
            </p>
          ) : (
            <ul className="mt-2 border-t border-[#E4E0D9]">
              {signed.map((card) => (
                <DashboardCardItem key={card.id} card={card} />
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}
