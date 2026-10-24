"use client";

import { useState, useTransition, type FormEvent } from "react";
import Link from "next/link";
import {
  claimMessage,
  searchUnclaimedMessages,
  updateMyMessage,
} from "@/lib/actions/dashboard";
import PhotoUpload from "../PhotoUpload";
interface MyMessage {
  id: string;
  authorName: string;
  messageText: string;
  images: string[];
}

interface UnclaimedMessage {
  id: string;
  authorName: string;
  suggested: boolean;
}

interface MyMessage {
  id: string;
  authorName: string;
  messageText: string;
  images: string[];
}

export interface DashboardCard {
  id: string;
  recipientName: string;
  recipientPhoto: string;
  mine: MyMessage | null;
}

export default function DashboardCardItem({ card }: { card: DashboardCard }) {
  const [open, setOpen] = useState(false);
  const signed = card.mine !== null;

  return (
    <li className="border-b border-[#EDEAE3] py-5">
      <div className="flex items-center gap-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={card.recipientPhoto}
          alt={card.recipientName}
          className="h-12 w-12 rounded-full object-cover"
        />
        <div className="min-w-0 flex-1">
          <p className="truncate text-[#23262B]">{card.recipientName}</p>
          <p
            className={`text-xs ${signed ? "text-[#4C6B52]" : "text-[#9A948A]"}`}
          >
            {signed ? "Ya firmaste" : "Sin firmar"}
          </p>
        </div>

        {signed ? (
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="text-sm text-[#7A5C61] hover:underline"
          >
            {open ? "Cerrar" : "Ver / editar"}
          </button>
        ) : (
          <Link
            href={`/dashboard/cards/${card.id}/sign`}
            className="rounded-md bg-[#23262B] px-3 py-1.5 text-sm text-white hover:bg-[#3A3D42]"
          >
            Firmar
          </Link>
        )}
      </div>

      {card.mine && open && <EditMessageForm message={card.mine} />}
      {card.mine && open && <EditMessageForm message={card.mine} />}
      {!signed && <ClaimSearch cardId={card.id} />}
    </li>
  );
}

function EditMessageForm({ message }: { message: MyMessage }) {
  const [authorName, setAuthorName] = useState(message.authorName);
  const [messageText, setMessageText] = useState(message.messageText);
  const [images, setImages] = useState<string[]>(message.images);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [saving, startTransition] = useTransition();

  function handleSave() {
    setError(null);
    setSaved(false);
    startTransition(async () => {
      const result = await updateMyMessage(message.id, {
        authorName,
        messageText,
        images,
      });
      if (result.error) setError(result.error);
      else setSaved(true);
    });
  }

  return (
    <div className="mt-4 space-y-4 rounded-md bg-white/60 p-4">
      <div>
        <label className="block text-sm text-[#4A4740]">Tu nombre</label>
        <input
          value={authorName}
          onChange={(e) => setAuthorName(e.target.value)}
          className="mt-1 w-full rounded-md border border-[#E4E0D9] bg-white px-3 py-2 text-sm text-[#23262B] focus:border-[#7A5C61] focus:outline-none"
        />
      </div>

      <div>
        <label className="block text-sm text-[#4A4740]">Tu mensaje</label>
        <textarea
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          rows={5}
          className="mt-1 w-full rounded-md border border-[#E4E0D9] bg-white px-3 py-2 text-sm text-[#23262B] focus:border-[#7A5C61] focus:outline-none"
        />
      </div>

      <div>
        <label className="block text-sm text-[#4A4740]">Fotos (hasta 3)</label>
        <div className="mt-1">
          <PhotoUpload
            maxFiles={3}
            initialUrls={message.images}
            onChange={setImages}
          />
        </div>
      </div>

      {error && <p className="text-sm text-[#B5473F]">{error}</p>}
      {saved && !saving && <p className="text-sm text-[#4C6B52]">Guardado.</p>}

      <button
        type="button"
        onClick={handleSave}
        disabled={saving || !authorName.trim() || !messageText.trim()}
        className="rounded-md bg-[#23262B] px-4 py-2 text-sm text-white hover:bg-[#3A3D42] disabled:opacity-50"
      >
        {saving ? "Guardando…" : "Guardar cambios"}
      </button>
    </div>
  );
}

function ClaimSearch({ cardId }: { cardId: string }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<
    { id: string; authorName: string }[] | null
  >(null);
  const [error, setError] = useState<string | null>(null);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [searching, startSearch] = useTransition();
  const [, startClaim] = useTransition();

  function handleSearch(e: FormEvent) {
    e.preventDefault();
    setError(null);
    startSearch(async () => {
      setResults(await searchUnclaimedMessages(cardId, query));
    });
  }

  function handleClaim(item: { id: string; authorName: string }) {
    const confirmed = window.confirm(
      `¿Confirmás que el mensaje de "${item.authorName}" es tuyo?`,
    );
    if (!confirmed) return;

    setError(null);
    setPendingId(item.id);
    startClaim(async () => {
      const result = await claimMessage(item.id);
      if (result.error) setError(result.error);
      setPendingId(null);
    });
  }

  return (
    <details className="mt-3 text-sm">
      <summary className="cursor-pointer text-[#7A5C61]">
        ¿Ya firmaste esta card? Buscá tu mensaje
      </summary>

      <form onSubmit={handleSearch} className="mt-2 flex gap-2">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Escribí el nombre con el que firmaste"
          className="w-full rounded-md border border-[#E4E0D9] bg-white px-3 py-2 text-sm text-[#23262B] focus:border-[#7A5C61] focus:outline-none"
        />
        <button
          type="submit"
          disabled={searching || query.trim().length < 2}
          className="whitespace-nowrap rounded-md border border-[#E4E0D9] px-3 py-2 text-[#4A4740] hover:bg-white disabled:opacity-50"
        >
          {searching ? "Buscando…" : "Buscar"}
        </button>
      </form>

      {results !== null && results.length === 0 && (
        <p className="mt-2 text-[#7A756B]">
          No encontramos mensajes con ese nombre.
        </p>
      )}

      {results && results.length > 0 && (
        <ul className="mt-2 space-y-1">
          {results.map((item) => (
            <li
              key={item.id}
              className="flex items-center justify-between rounded-md bg-white/50 px-3 py-2"
            >
              <span className="text-[#23262B]">{item.authorName}</span>
              <button
                type="button"
                onClick={() => handleClaim(item)}
                disabled={pendingId === item.id}
                className="text-[#7A5C61] hover:underline disabled:opacity-50"
              >
                {pendingId === item.id ? "Reclamando…" : "Es mío"}
              </button>
            </li>
          ))}
        </ul>
      )}

      {error && <p className="mt-2 text-[#B5473F]">{error}</p>}
    </details>
  );
}
