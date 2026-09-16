"use client";

import { closeCard, deleteCard, updateCard } from "@/lib/cards";
import { useState, useTransition } from "react";
import PhotoUpload from "../PhotoUpload";

interface EditCardFormProps {
  card: {
    id: string;
    recipientName: string;
    recipientPhoto: string;
    isClosed: boolean;
    viewSlug: string | null;
  };
}

export default function EditCardForm({ card }: EditCardFormProps) {
  const [recipientName, setRecipientName] = useState(card.recipientName);
  const [photoUrl, setPhotoUrl] = useState(card.recipientPhoto);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [saving, startSaveTransition] = useTransition();
  const [deleting, startDeleteTransition] = useTransition();

  const [isClosed, setIsClosed] = useState(card.isClosed);
  const [viewSlug, setViewSlug] = useState(card.viewSlug);
  const [closeError, setCloseError] = useState<string | null>(null);
  const [closing, startCloseTransition] = useTransition();
  const [copied, setCopied] = useState(false);

  function handleSave() {
    setError(null);
    startSaveTransition(async () => {
      try {
        await updateCard(card.id, { recipientName, recipientPhoto: photoUrl });
        setSaved(true);
      } catch (err) {
        console.error(err);
        setError("Something went wrong saving changes.");
      }
    });
  }

  function handleDelete() {
    const confirmed = window.confirm(
      `Delete the card for ${card.recipientName}? This also deletes all of its messages. This can't be undone.`,
    );
    if (!confirmed) return;

    startDeleteTransition(async () => {
      try {
        await deleteCard(card.id);
      } catch (err) {
        console.error(err);
      }
    });
  }

  function handleClose() {
    const confirmed = window.confirm(
      "Close this card? Contributors will no longer be able to submit messages, and a public view link will be generated.",
    );
    if (!confirmed) return;

    setCloseError(null);
    startCloseTransition(async () => {
      try {
        const result = await closeCard(card.id);
        setIsClosed(true);
        setViewSlug(result.viewSlug);
      } catch (err) {
        console.error(err);
        setCloseError("Something went wrong closing the card.");
      }
    });
  }

  const viewUrl = viewSlug
    ? `${window.location.origin}/card/${viewSlug}/view`
    : null;

  function handleCopy() {
    if (!viewUrl) return;
    navigator.clipboard.writeText(viewUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm text-[#4A4740]">Recipient name</label>
        <input
          value={recipientName}
          onChange={(e) => {
            setRecipientName(e.target.value);
            setSaved(false);
          }}
          disabled={isClosed}
          className="mt-1 w-full max-w-sm rounded-md border border-[#E4E0D9] bg-white px-3 py-2 text-sm text-[#23262B] focus:border-[#7A5C61] focus:outline-none disabled:opacity-60"
        />
      </div>

      <div>
        <label className="block text-sm text-[#4A4740]">Recipient photo</label>
        <div className="mt-1 flex items-center gap-4">
          {photoUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={photoUrl}
              alt={recipientName}
              className="h-16 w-16 rounded-full object-cover"
            />
          )}
          {!isClosed && (
            <PhotoUpload
              maxFiles={1}
              onChange={(urls) => {
                if (urls[0]) {
                  setPhotoUrl(urls[0]);
                  setSaved(false);
                }
              }}
            />
          )}
        </div>
      </div>

      {error && <p className="text-sm text-[#B5473F]">{error}</p>}
      {saved && !saving && <p className="text-sm text-[#4C6B52]">Saved.</p>}

      {!isClosed && (
        <div className="flex items-center justify-between border-t border-[#E4E0D9] pt-6">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving || !recipientName || !photoUrl}
            className="rounded-md bg-[#23262B] px-4 py-2 text-sm text-white transition-colors hover:bg-[#3A3D42] disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save changes"}
          </button>

          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="text-sm text-[#B5473F] hover:underline disabled:opacity-50"
          >
            {deleting ? "Deleting…" : "Delete card"}
          </button>
        </div>
      )}

      <div className="border-t border-[#E4E0D9] pt-6">
        {!isClosed ? (
          <div>
            <p className="text-sm text-[#7A756B]">
              Closing this card stops new submissions and generates a public
              link to share.
            </p>
            <button
              type="button"
              onClick={handleClose}
              disabled={closing}
              className="mt-3 rounded-md border border-[#23262B] px-4 py-2 text-sm text-[#23262B] hover:bg-[#23262B] hover:text-white disabled:opacity-50"
            >
              {closing ? "Closing…" : "Close card & generate link"}
            </button>
            {closeError && (
              <p className="mt-2 text-sm text-[#B5473F]">{closeError}</p>
            )}
          </div>
        ) : (
          <div>
            <p className="text-sm text-[#4C6B52]">This card is closed.</p>
            {viewUrl && (
              <div className="mt-3 flex items-center gap-2">
                <input
                  readOnly
                  value={viewUrl}
                  className="w-full max-w-md rounded-md border border-[#E4E0D9] bg-white px-3 py-2 text-sm text-[#23262B]"
                />
                <button
                  type="button"
                  onClick={handleCopy}
                  className="whitespace-nowrap rounded-md border border-[#E4E0D9] px-3 py-2 text-sm text-[#4A4740] hover:bg-white"
                >
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
            )}
            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="text-sm text-[#B5473F] hover:underline disabled:opacity-50"
              >
                {deleting ? "Deleting…" : "Delete card"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
