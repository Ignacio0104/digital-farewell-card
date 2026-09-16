"use client";

import { useState } from "react";
import { headlineFont } from "./fonts";
import NameScatter, { type ViewMessage } from "./NameScatter";
import PrintLayout from "./PrintLayout";

interface LetterViewProps {
  recipientName: string;
  recipientPhoto: string;
  messages: ViewMessage[];
}

const STAR_POSITIONS = Array.from({ length: 40 }).map((_, i) => ({
  top: `${(i * 37) % 100}%`,
  left: `${(i * 53) % 100}%`,
  opacity: 0.3 + ((i * 13) % 70) / 100,
}));

export default function LetterView({
  recipientName,
  recipientPhoto,
  messages,
}: LetterViewProps) {
  const [opened, setOpened] = useState(false);

  return (
    <>
      <main className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#0B0930] via-[#1B1450] to-[#2E1B5E] print:hidden">
        <div className="pointer-events-none absolute inset-0">
          {STAR_POSITIONS.map((pos, i) => (
            <span
              key={i}
              className="absolute h-1 w-1 rounded-full bg-white"
              style={{ top: pos.top, left: pos.left, opacity: pos.opacity }}
            />
          ))}
        </div>

        <svg
          viewBox="0 0 800 200"
          className="pointer-events-none absolute bottom-0 left-0 w-full text-[#160F3D]"
          preserveAspectRatio="none"
        >
          <path
            fill="currentColor"
            d="M0,200 L0,120 L40,120 L40,90 L60,90 L60,60 L80,60 L80,90 L100,90 L100,120 L160,120 L160,60 L180,60 L180,30 L190,10 L200,30 L200,60 L220,60 L220,120 L300,120 L300,80 L320,80 L320,40 L340,20 L360,40 L360,80 L380,80 L380,120 L460,120 L460,90 L480,90 L480,60 L500,60 L500,90 L520,90 L520,120 L600,120 L600,70 L620,70 L620,30 L640,10 L660,30 L660,70 L680,70 L680,120 L740,120 L740,90 L760,90 L760,120 L800,120 L800,200 Z"
          />
        </svg>

        <button
          type="button"
          onClick={() => window.print()}
          className="fixed right-4 top-4 z-40 rounded-full bg-white/10 px-4 py-2 text-sm text-white backdrop-blur transition-colors hover:bg-white/20"
        >
          🖨️ Print
        </button>

        {!opened ? (
          <FrontPanel onOpen={() => setOpened(true)} />
        ) : (
          <BackPanel
            recipientName={recipientName}
            recipientPhoto={recipientPhoto}
            messages={messages}
          />
        )}
      </main>

      <PrintLayout
        recipientName={recipientName}
        recipientPhoto={recipientPhoto}
        messages={messages}
      />
    </>
  );
}

function FrontPanel({ onOpen }: { onOpen: () => void }) {
  return (
    <div className="relative flex min-h-screen items-center justify-center px-6">
      <button
        type="button"
        onClick={onOpen}
        className="group relative flex w-full max-w-sm flex-col items-center gap-6 rounded-2xl border border-[#F6E27A]/40 bg-gradient-to-b from-[#2A1F63] to-[#1B1440] px-8 py-14 text-center shadow-2xl transition-transform duration-500 hover:scale-[1.02]"
      >
        <span className="text-4xl">✨</span>
        <p
          className={`${headlineFont.className} text-2xl leading-snug text-[#F6E27A]`}
        >
          Thanks for making this project MAGIC
        </p>
        <span className="text-sm uppercase tracking-[0.2em] text-white/60 group-hover:text-white">
          Tap to open
        </span>
      </button>
    </div>
  );
}

function BackPanel({
  recipientName,
  recipientPhoto,
  messages,
}: {
  recipientName: string;
  recipientPhoto: string;
  messages: ViewMessage[];
}) {
  return (
    <div className="relative animate-[fadeIn_0.6s_ease-out] px-6 py-16 text-center">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={recipientPhoto}
        alt={recipientName}
        className="mx-auto h-24 w-24 rounded-full border-4 border-[#F6E27A]/60 object-cover shadow-lg"
      />
      <p className={`${headlineFont.className} mt-6 text-4xl text-[#F6E27A]`}>
        We&apos;ll miss you
      </p>
      <p className="mt-2 text-lg text-white/80">{recipientName}</p>

      <NameScatter messages={messages} />
    </div>
  );
}
