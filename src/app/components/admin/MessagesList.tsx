"use client";

import { useState } from "react";
import MessageModal from "./MessageModal";

export interface AdminMessageRow {
  id: string;
  authorName: string;
  messageText: string;
  images: string[];
  createdAt: string;
}

interface MessagesListProps {
  cardId: string;
  messages: AdminMessageRow[];
}

export default function MessagesList({ cardId, messages }: MessagesListProps) {
  const [selected, setSelected] = useState<AdminMessageRow | null>(null);

  if (messages.length === 0) {
    return (
      <p className="rounded-md border border-dashed border-[#E4E0D9] bg-white/40 px-6 py-10 text-center text-sm text-[#7A756B]">
        No messages submitted yet.
      </p>
    );
  }

  return (
    <>
      <ul className="divide-y divide-[#EDEAE3] border-t border-[#E4E0D9]">
        {messages.map((m) => (
          <li key={m.id}>
            <button
              type="button"
              onClick={() => setSelected(m)}
              className="flex w-full items-center justify-between gap-4 py-4 text-left hover:bg-white/50"
            >
              <div className="min-w-0">
                <p className="text-sm text-[#23262B]">{m.authorName}</p>
                <p className="mt-0.5 truncate text-sm text-[#7A756B]">
                  {m.messageText}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-3 text-xs text-[#9A948A]">
                {m.images.length > 0 && (
                  <span>
                    {m.images.length} photo{m.images.length > 1 ? "s" : ""}
                  </span>
                )}
                <span>{new Date(m.createdAt).toLocaleDateString()}</span>
              </div>
            </button>
          </li>
        ))}
      </ul>

      {selected && (
        <MessageModal
          cardId={cardId}
          message={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </>
  );
}
