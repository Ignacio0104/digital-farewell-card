"use client";

import { createCard, CreateCardState } from "@/lib/cards";
import { useState, useTransition } from "react";
import PhotoUpload from "../PhotoUpload";

const initialState: CreateCardState = { error: null, success: false };

function generatePasscode() {
  const chars = "ABCDEFGHJKMNPQRSTUVWXYZ23456789"; // skips 0/O, 1/I/L to avoid mixups
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

interface NewCardModalProps {
  onClose: () => void;
}

export default function NewCardModal({ onClose }: NewCardModalProps) {
  const [photoUrl, setPhotoUrl] = useState("");
  const [passcode, setPasscode] = useState(() => generatePasscode());
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await createCard(initialState, formData);
      if (result.success) {
        onClose();
      } else {
        setError(result.error);
      }
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
      <div className="w-full max-w-md rounded-lg bg-[#FBFAF7] p-6 shadow-xl">
        <h2 className="font-serif text-xl text-[#23262B]">New card</h2>

        <form action={handleSubmit} className="mt-6 space-y-5">
          <input type="hidden" name="recipientPhoto" value={photoUrl} />

          <div>
            <label className="block text-sm text-[#4A4740]">
              Recipient name
            </label>
            <input
              name="recipientName"
              required
              className="mt-1 w-full rounded-md border border-[#E4E0D9] bg-white px-3 py-2 text-sm text-[#23262B] focus:border-[#7A5C61] focus:outline-none"
              placeholder="e.g. Priya Shah"
            />
          </div>

          <div>
            <label className="block text-sm text-[#4A4740]">
              Recipient photo
            </label>
            <div className="mt-1">
              <PhotoUpload
                maxFiles={1}
                onChange={(urls) => setPhotoUrl(urls[0] ?? "")}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-[#4A4740]">Passcode</label>
            <div className="mt-1 flex gap-2">
              <input
                name="passcode"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                required
                className="w-full rounded-md border border-[#E4E0D9] bg-white px-3 py-2 text-sm text-[#23262B] focus:border-[#7A5C61] focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setPasscode(generatePasscode())}
                className="whitespace-nowrap rounded-md border border-[#E4E0D9] px-3 py-2 text-sm text-[#4A4740] hover:bg-white"
              >
                Generate
              </button>
            </div>
          </div>

          {error && <p className="text-sm text-[#B5473F]">{error}</p>}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-[#7A756B] hover:text-[#23262B]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={pending || !photoUrl}
              className="rounded-md bg-[#23262B] px-4 py-2 text-sm text-white transition-colors hover:bg-[#3A3D42] disabled:opacity-50"
            >
              {pending ? "Creating…" : "Create card"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
