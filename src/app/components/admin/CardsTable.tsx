export interface AdminCardRow {
  id: string;
  recipientName: string;
  isClosed: boolean;
  createdAt: string;
  viewSlug: string | null;
}

interface CardsTableProps {
  cards: AdminCardRow[];
}

export default function CardsTable({ cards }: CardsTableProps) {
  if (cards.length === 0) {
    return (
      <div className="rounded-md border border-dashed border-[#E4E0D9] bg-white/40 px-8 py-16 text-center">
        <p className="font-serif text-lg text-[#23262B]">No cards yet</p>
        <p className="mx-auto mt-1 max-w-xs text-sm text-[#7A756B]">
          Create one to get a passcode-protected link you can send around.
        </p>
      </div>
    );
  }

  return (
    <table className="w-full border-collapse text-left text-sm">
      <thead>
        <tr className="border-b border-[#E4E0D9] text-[#7A756B]">
          <th className="py-3 pr-4 font-normal">Recipient</th>
          <th className="py-3 pr-4 font-normal">Status</th>
          <th className="py-3 pr-4 font-normal">Created</th>
          <th className="py-3 pr-4 font-normal">Submission link</th>
          <th className="py-3 pr-4 font-normal">View link</th>
          <th className="py-3 pr-0 font-normal"></th>
        </tr>
      </thead>
      <tbody>
        {cards.map((card) => (
          <tr key={card.id} className="border-b border-[#EDEAE3]">
            <td className="py-3 pr-4 text-[#23262B]">{card.recipientName}</td>
            <td className="py-3 pr-4">
              <span className="inline-flex items-center gap-1.5">
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    card.isClosed ? "bg-[#9A948A]" : "bg-[#4C6B52]"
                  }`}
                />
                <span className="text-[#4A4740]">
                  {card.isClosed ? "Closed" : "Active"}
                </span>
              </span>
            </td>
            <td className="py-3 pr-4 text-[#7A756B]">
              {new Date(card.createdAt).toLocaleDateString()}
            </td>
            <td className="py-3 pr-4 text-[#7A756B]">
              {card.isClosed ? (
                <span>—</span>
              ) : (
                <a
                  href={`/card/${card.id}/submit`}
                  className="text-[#7A5C61] hover:underline"
                >
                  /card/{card.id}/submit
                </a>
              )}
            </td>
            <td className="py-3 pr-4 text-[#7A756B]">
              {card.viewSlug ? (
                <a
                  href={`/card/${card.viewSlug}/view`}
                  className="text-[#7A5C61] hover:underline"
                >
                  /card/{card.viewSlug}/view
                </a>
              ) : (
                <span>—</span>
              )}
            </td>
            <td className="py-3 pr-0 text-right">
              <a
                href={`/admin/cards/${card.id}`}
                className="text-[#7A5C61] hover:underline"
              >
                Manage
              </a>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
