"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function SubmitEntryPage() {
  const [cardId, setCardId] = useState("");
  const router = useRouter();

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = cardId.trim();
    console.log(trimmed);
    if (!trimmed) return;
    router.push(`/card/${trimmed}/submit`);
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#FBFAF7] px-6">
      <div className="w-full max-w-sm">
        <h1 className="font-serif text-2xl text-[#23262B]">Leave a message</h1>
        <p className="mt-2 text-sm text-[#7A756B]">
          Enter the card ID you were given to continue.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input
            value={cardId}
            onChange={(e) => setCardId(e.target.value)}
            placeholder="Card ID"
            autoFocus
            className="w-full rounded-md border border-[#E4E0D9] bg-white px-3 py-2 text-sm text-[#23262B] focus:border-[#7A5C61] focus:outline-none"
          />
          <button
            type="submit"
            disabled={!cardId.trim()}
            className="w-full rounded-md bg-[#23262B] px-4 py-2 text-sm text-white transition-colors hover:bg-[#3A3D42] disabled:opacity-50"
          >
            Continue
          </button>
        </form>
      </div>
    </main>
  );
}
