"use client";

import { styleForName } from "./fonts";
import type { ViewMessage } from "./NameScatter";

interface ViewMessageModalProps {
  message: ViewMessage;
  onClose: () => void;
}

export default function ViewMessageModal({
  message,
  onClose,
}: ViewMessageModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 animate-[fadeIn_0.2s_ease-out]"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-[#F6E27A]/30 bg-[#1B1440] p-6 shadow-2xl animate-[modalPop_0.25s_ease-out]"
      >
        <div className="flex items-start justify-between gap-4">
          <h2 style={styleForName(message.id)} className="text-3xl">
            {message.authorName}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-white/60 hover:text-white cursor-pointer"
          >
            ✕
          </button>
        </div>

        <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-white/90">
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
      </div>
    </div>
  );
}
