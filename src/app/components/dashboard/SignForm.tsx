"use client";

import { useState, useTransition, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { submitMyMessage } from "@/lib/actions/dashboard";
import PhotoUpload from "../PhotoUpload";

interface SignFormProps {
  cardId: string;
  recipientName: string;
  defaultName: string;
}

export default function SignForm({
  cardId,
  recipientName,
  defaultName,
}: SignFormProps) {
  const router = useRouter();
  const [authorName, setAuthorName] = useState(defaultName);
  const [messageText, setMessageText] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = await submitMyMessage(cardId, {
        authorName,
        messageText,
        images,
      });
      if (result.error) setError(result.error);
      else router.push("/dashboard");
    });
  }

  return (
    <div className="w-full max-w-sm">
      <h1 className="font-serif text-2xl text-[#23262B]">
        Un mensaje para {recipientName}
      </h1>

      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        <div>
          <label className="block text-sm text-[#4A4740]">Tu nombre</label>
          <input
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            required
            className="mt-1 w-full rounded-md border border-[#E4E0D9] bg-white px-3 py-2 text-sm text-[#23262B] focus:border-[#7A5C61] focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm text-[#4A4740]">Tu mensaje</label>
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
            Fotos (opcional, hasta 3)
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
          {pending ? "Enviando…" : "Enviar mensaje"}
        </button>
      </form>
    </div>
  );
}
