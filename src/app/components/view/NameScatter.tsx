"use client";

import { useState } from "react";
import { styleForName } from "./fonts";
import ViewMessageModal from "./ViewMessageModal";

export interface ViewMessage {
  id: string;
  authorName: string;
  messageText: string;
  images: string[];
}

interface NameScatterProps {
  messages: ViewMessage[];
}

function truncateName(name: string, max = 30): string {
  return name.length > max ? `${name.slice(0, max).trimEnd()}…` : name;
}

export default function NameScatter({ messages }: NameScatterProps) {
  const [selected, setSelected] = useState<ViewMessage | null>(null);

  if (messages.length === 0) {
    return <p className="mt-10 text-center text-white/70">No messages yet.</p>;
  }

  return (
    <>
      <div className="mt-6 bg-[url('/assets/paper-background.jpg')] rounded-xl bg-cover bg-center mx-auto flex max-w-2xl flex-wrap items-center justify-center gap-x-6 gap-y-4 px-6 py-10">
        {messages.map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => setSelected(m)}
            style={styleForName(m.id)}
            title={m.authorName}
            className="text-2xl transition-transform duration-200 cursor-pointer hover:scale-110 sm:text-3xl"
          >
            {truncateName(m.authorName)}
          </button>
        ))}
      </div>

      {selected && (
        <ViewMessageModal
          message={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </>
  );
}
