"use client";

import { useState } from "react";
import {
  cinzel,
  headlineFont,
  kalam,
  monimerSerif,
  pacifico,
  shadowsIntoLight,
} from "./fonts";
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

type Stage = "closed" | "opening" | "open";

export default function LetterView({
  recipientName,
  recipientPhoto,
  messages,
}: LetterViewProps) {
  const [stage, setStage] = useState<Stage>("closed");

  function handleOpen() {
    setStage("opening");
    setTimeout(() => setStage("open"), 700); // matches the flap's transition duration
  }

  function handleEnvelopeClose() {
    setStage("closed");
  }

  return (
    <>
      <main className="relative min-h-screen overflow-hidden bg-[url('/assets/cinderella-castle-3840x2160-9839.jpg')] bg-cover bg-center print:hidden">
        <WaxSeal stage={stage} />
        <button
          type="button"
          onClick={() => window.print()}
          className="fixed right-4 top-4 z-40 rounded-full bg-white/10 px-4 py-2 text-sm text-white backdrop-blur transition-colors hover:bg-white/20"
        >
          🖨️ Print
        </button>

        {stage !== "open" ? (
          <Envelope stage={stage} onOpen={handleOpen} />
        ) : (
          <BackPanel
            recipientName={recipientName}
            recipientPhoto={recipientPhoto}
            messages={messages}
            onEnvelopeClose={handleEnvelopeClose}
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

function Envelope({ stage, onOpen }: { stage: Stage; onOpen: () => void }) {
  const isOpening = stage === "opening";

  return (
    <div className="relative  flex min-h-screen items-center justify-center px-6">
      <button
        type="button"
        onClick={onOpen}
        disabled={isOpening}
        className="group relative cursor-pointer"
        style={{
          width: "515px",
          height: "385px",
          maxWidth: "100%",
          perspective: "1200px",
        }}
      >
        {/* Envelope body */}
        <div className="relative cursor-pointer flex h-full w-full flex-col items-center justify-end overflow-hidden rounded-lg border border-[#F6E27A]/40 bg-gradient-to-b from-[#2A1F63] to-[#1B1440] px-10 pb-10 text-center shadow-2xl transition-transform duration-500 group-hover:scale-[1.02]">
          <p
            className={`${cinzel.className} text-3xl leading-snug text-[#F6E27A] sm:text-xl`}
          >
            Thanks for making this project
            <span className="relative inline-block pt-8">
              <span
                className={`${headlineFont.className} magic-glow-text block text-3xl`}
              >
                MAGIC
              </span>

              {/* Scattered sparkles, staggered so they twinkle out of sync */}
              <span
                className="magic-sparkle left-[-18px] top-[-6px] text-lg"
                style={{ animationDelay: "0s" }}
              >
                ✨
              </span>
              <span
                className="magic-sparkle right-[-20px] top-[2px] text-sm"
                style={{ animationDelay: "0.4s" }}
              >
                ✦
              </span>
              <span
                className="magic-sparkle left-[10%] bottom-[-14px] text-base"
                style={{ animationDelay: "0.9s" }}
              >
                ✦
              </span>
              <span
                className="magic-sparkle right-[8%] bottom-[-10px] text-sm"
                style={{ animationDelay: "1.3s" }}
              >
                ✨
              </span>
            </span>
          </p>
          <span className="mt-8 block text-base uppercase tracking-[0.2em] text-white/60 group-hover:text-white">
            Tap to open
          </span>
        </div>

        {/* Envelope flap, hinged at the top, folds back when opened */}
        <div
          className="absolute left-0 top-0 h-40 w-full transition-transform duration-700 ease-in-out"
          style={{
            transformOrigin: "top center",
            transformStyle: "preserve-3d",
            transform: isOpening ? "rotateX(-170deg)" : "rotateX(0deg)",
          }}
        >
          <div
            className="h-full w-full bg-gradient-to-b from-[#3C2E82] to-[#2A1F63]"
            style={{ clipPath: "polygon(0 0, 50% 100%, 100% 0)" }}
          />
        </div>
      </button>
    </div>
  );
}

function BackPanel({
  recipientName,
  recipientPhoto,
  messages,
  onEnvelopeClose,
}: {
  recipientName: string;
  recipientPhoto: string;
  messages: ViewMessage[];
  onEnvelopeClose: () => void;
}) {
  return (
    <div className="relative animate-[fadeIn_0.6s_ease-out] px-6 py-16 text-center">
      <button
        type="button"
        onClick={onEnvelopeClose}
        aria-label="Close the envelope"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={recipientPhoto}
          alt={recipientName}
          className="mx-auto h-24 w-24 cursor-pointer rounded-full border-4 border-[#F6E27A]/60 object-cover shadow-lg transition-transform hover:scale-105"
        />
      </button>
      <p className={`${monimerSerif.className} mt-6 text-3xl text-white/80`}>
        We&apos;ll miss you
      </p>
      <p className={`${headlineFont.className} mt-8 text-4xl  text-[#F6E27A] `}>
        {recipientName}
      </p>

      <NameScatter messages={messages} />
    </div>
  );
}

function WaxSeal({ stage }: { stage: Stage }) {
  const isClosed = stage === "closed";

  return (
    <img
      src="/assets/sello-no-bg.png"
      alt=""
      aria-hidden="true"
      className="pointer-events-none fixed z-30 transition-all duration-700 ease-in-out "
      style={
        isClosed
          ? {
              top: "calc(50% - 72px)",
              left: "50%",
              width: "130px",
              height: "130px",
              transform: "translate(-50%, -50%)",
            }
          : {
              top: "24px",
              left: "24px",
              width: "130px",
              height: "130px",
              transform: "translate(0, 0)",
            }
      }
    />
  );
}
