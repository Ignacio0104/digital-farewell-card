"use client";

import { useState, useTransition, type FormEvent } from "react";
import { submitMessage } from "@/lib/actions/messages";
import PhotoUpload from "@/app/components/PhotoUpload";

interface MessageFormProps {
  cardId: string;
  recipientName: string;
  passcode: string;
}

export default function MessageForm({
  cardId,
  recipientName,
  passcode,
}: MessageFormProps) {
  const [authorName, setAuthorName] = useState("");
  const [messageText, setMessageText] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [pending, startTransition] = useTransition();

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = await submitMessage(cardId, {
        authorName,
        messageText,
        images,
        passcode,
      });
      if (result.success) {
        setSubmitted(true);
      } else {
        setError(result.error);
      }
    });
  }

  if (submitted) {
    return (
      <div className="w-full max-w-sm text-center">
        <h1 className="font-serif text-2xl text-[#23262B]">Message sent</h1>
        <p className="mt-2 text-sm text-[#7A756B]">
          Thanks — your message for {recipientName} has been added.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm">
      <h1 className="font-serif text-2xl text-[#23262B]">
        A message for {recipientName}
      </h1>

      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        <div>
          <label className="block text-sm text-[#4A4740]">Your name</label>
          <input
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            required
            className="mt-1 w-full rounded-md border border-[#E4E0D9] bg-white px-3 py-2 text-sm text-[#23262B] focus:border-[#7A5C61] focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm text-[#4A4740]">Your message</label>
          <textarea
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            required
            rows={5}
            className="mt-1 w-full rounded-md border border-[#E4E0D9] bg-white px-3 py-2 text-sm text-[#23262B] focus:border-[#7A5C61] focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm text-[#4A4740]">
            Photos (optional, up to 3)
          </label>
          <div className="mt-1">
            <PhotoUpload maxFiles={3} onChange={setImages} />
          </div>
        </div>

        {error && <p className="text-sm text-[#B5473F]">{error}</p>}

        <button
          type="submit"
          disabled={pending || !authorName.trim() || !messageText.trim()}
          className="w-full rounded-md bg-[#23262B] px-4 py-2 text-sm text-white transition-colors hover:bg-[#3A3D42] disabled:opacity-50"
        >
          {pending ? "Sending…" : "Send message"}
        </button>
      </form>
    </div>
  );
}
