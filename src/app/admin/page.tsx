import { prisma } from "@/lib/prisma";
import { AdminCardRow } from "../components/admin/CardsTable";
import AdminDashboard from "../components/admin/AdminDashboard";

export default async function AdminPage() {
  const cards = await prisma.card.findMany({ orderBy: { createdAt: "desc" } });

  const rows: AdminCardRow[] = cards.map((c) => ({
    id: c.id,
    recipientName: c.recipientName,
    isClosed: c.isClosed,
    createdAt: c.createdAt.toISOString(),
    viewSlug: c.viewSlug,
  }));

  return (
    <main className="min-h-screen bg-[#FBFAF7] px-6 py-12 sm:px-12">
      <div className="mx-auto max-w-3xl">
        <AdminDashboard cards={rows} />
      </div>
    </main>
  );
}
