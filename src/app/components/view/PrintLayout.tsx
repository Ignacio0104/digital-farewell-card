import { headlineFont, monimerSerif, styleForName } from "./fonts";
import type { ViewMessage } from "./NameScatter";
import type { CSSProperties } from "react";

interface PrintLayoutProps {
  recipientName: string;
  recipientPhoto: string;
  messages: ViewMessage[];
}

const CASTLE_BG_STYLE: CSSProperties = {
  backgroundImage:
    "linear-gradient(rgba(11, 9, 48, 0.75), rgba(27, 20, 80, 0.75)), url('/assets/cinderella-castle-3840x2160-9839.jpg')",
  backgroundSize: "cover",
  backgroundPosition: "center",
};

const PAPER_BG_STYLE: CSSProperties = {
  backgroundColor: "#e9dcb8",
  backgroundImage: `
    radial-gradient(circle at 15% 20%, rgba(139, 111, 62, 0.12) 0%, transparent 35%),
    radial-gradient(circle at 85% 15%, rgba(139, 111, 62, 0.1) 0%, transparent 40%),
    radial-gradient(circle at 25% 85%, rgba(139, 111, 62, 0.15) 0%, transparent 40%),
    radial-gradient(circle at 90% 80%, rgba(139, 111, 62, 0.1) 0%, transparent 35%),
    url('/assets/paper-background.jpg')
  `,
  backgroundSize: "cover, cover, cover, cover, 500px",
  backgroundRepeat: "no-repeat, no-repeat, no-repeat, no-repeat, repeat",
  backgroundPosition: "center",
};

export default function PrintLayout({
  recipientName,
  recipientPhoto,
  messages,
}: PrintLayoutProps) {
  return (
    <div className="hidden print:block">
      {/* Page 1: names — unchanged, still the castle background */}
      <section
        className="print-page relative flex min-h-screen flex-col items-center justify-center px-8 text-center"
        style={CASTLE_BG_STYLE}
      >
        <img
          src="/assets/sello-no-bg.png"
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute z-30"
          style={{
            top: "24px",
            right: "24px",
            width: "130px",
            height: "130px",
          }}
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={recipientPhoto}
          alt={recipientName}
          className="h-24 w-24 rounded-full border-4 border-[#F6E27A]/60 object-cover"
        />
        <p className={`${monimerSerif.className} mt-6 text-3xl text-white/80`}>
          We&apos;ll miss you
        </p>
        <p
          className={`${headlineFont.className} mt-8 text-4xl  text-[#F6E27A] `}
        >
          {recipientName}
        </p>

        <div className="mt-10 flex max-w-xl flex-wrap items-center justify-center gap-x-6 gap-y-4">
          {messages.map((m) => (
            <span key={m.id} style={styleForName(m.id)} className="text-2xl">
              {m.authorName}
            </span>
          ))}
        </div>
      </section>

      {/* Messages, now on a parchment background instead of the castle */}
      <section className="min-h-screen px-10 py-10" style={PAPER_BG_STYLE}>
        {messages.map((m) => {
          const nameStyle = styleForName(m.id);
          return (
            <div key={m.id} className="print-message mb-10">
              <h2
                style={{
                  fontFamily: nameStyle.fontFamily,
                  color: nameStyle.color,
                }}
                className="text-2xl"
              >
                {m.authorName}
              </h2>
              <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-[#3A2F1E]">
                {m.messageText}
              </p>
              {m.images.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-3">
                  {m.images.map((url) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      key={url}
                      src={url}
                      alt={`Photo from ${m.authorName}`}
                      className="h-28 w-28 rounded-lg border border-[#8B6F3E]/30 object-cover"
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </section>
    </div>
  );
}
