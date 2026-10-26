"use client";

import { useTransition } from "react";
import { deleteMessage } from "@/lib/actions/messages";
import { AdminMessageRow } from "./MessagesList";

interface MessageModalProps {
  cardId: string;
  message: AdminMessageRow;
  onClose: () => void;
}

export default function MessageModal({
  cardId,
  message,
  onClose,
}: MessageModalProps) {
  const [deleting, startTransition] = useTransition();

  function handleDelete() {
    const confirmed = window.confirm(
      `Delete this message from ${message.authorName}? This can't be undone.`,
    );
    if (!confirmed) return;

    startTransition(async () => {
      await deleteMessage(message.id, cardId);
      onClose();
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
      <div className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-lg bg-[#FBFAF7] p-6 shadow-xl">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="font-serif text-xl text-[#23262B]">
              {message.authorName}
            </h2>
            <p className="mt-0.5 text-xs text-[#9A948A]">
              {new Date(message.createdAt).toLocaleString()}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-[#7A756B] hover:text-[#23262B]"
          >
            ✕
          </button>
        </div>

        <p className="mt-5 whitespace-pre-wrap text-sm leading-relaxed text-[#23262B]">
          {message.messageText}
        </p>

        {message.images.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-3">
            {message.images.map((url) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={url}
                src={url}
                alt={`Photo from ${message.authorName}`}
                className="h-28 w-28 rounded-lg object-cover"
              />
            ))}
          </div>
        )}

        <div className="mt-6 flex justify-end border-t border-[#E4E0D9] pt-4">
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="text-sm text-[#B5473F] hover:underline disabled:opacity-50"
          >
            {deleting ? "Deleting…" : "Delete message"}
          </button>
        </div>
      </div>
    </div>
  );
}
