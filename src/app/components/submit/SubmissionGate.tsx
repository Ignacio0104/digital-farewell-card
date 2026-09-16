"use client";

import { useState, useTransition, type FormEvent } from "react";
import { verifyPasscode } from "@/lib/actions/messages";
import MessageForm from "../admin/MessageForm";
interface SubmissionGateProps {
  cardId: string;
  recipientName: string;
}

export default function SubmissionGate({
  cardId,
  recipientName,
}: SubmissionGateProps) {
  const [unlocked, setUnlocked] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleUnlock(e: FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = await verifyPasscode(cardId, passcode);
      if (result.ok) {
        setUnlocked(true);
      } else {
        setError(result.error ?? "Incorrect passcode.");
      }
    });
  }

  if (unlocked) {
    return (
      <MessageForm
        cardId={cardId}
        recipientName={recipientName}
        passcode={passcode}
      />
    );
  }

  return (
    <div className="w-full max-w-sm">
      <h1 className="font-serif text-2xl text-[#23262B]">
        A message for {recipientName}
      </h1>
      <p className="mt-2 text-sm text-[#7A756B]">
        Enter the passcode you were given.
      </p>

      <form onSubmit={handleUnlock} className="mt-6 space-y-4">
        <input
          value={passcode}
          onChange={(e) => setPasscode(e.target.value)}
          placeholder="Passcode"
          autoFocus
          className="w-full rounded-md border border-[#E4E0D9] bg-white px-3 py-2 text-sm text-[#23262B] focus:border-[#7A5C61] focus:outline-none"
        />
        {error && <p className="text-sm text-[#B5473F]">{error}</p>}
        <button
          type="submit"
          disabled={pending || !passcode.trim()}
          className="w-full rounded-md bg-[#23262B] px-4 py-2 text-sm text-white transition-colors hover:bg-[#3A3D42] disabled:opacity-50"
        >
          {pending ? "Checking…" : "Continue"}
        </button>
      </form>
    </div>
  );
}
