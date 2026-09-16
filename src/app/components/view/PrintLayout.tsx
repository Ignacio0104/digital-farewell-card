import { headlineFont, styleForName } from "./fonts";
import type { ViewMessage } from "./NameScatter";

interface PrintLayoutProps {
  recipientName: string;
  recipientPhoto: string;
  messages: ViewMessage[];
}

const PRINT_BG = "linear-gradient(to bottom, #0B0930, #1B1450, #2E1B5E)";

export default function PrintLayout({
  recipientName,
  recipientPhoto,
  messages,
}: PrintLayoutProps) {
  return (
    <div className="hidden print:block" style={{ background: PRINT_BG }}>
      {/* Page 1: names */}
      <section
        className="print-page flex min-h-[9in] flex-col items-center justify-center px-8 text-center"
        style={{ background: PRINT_BG }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={recipientPhoto}
          alt={recipientName}
          className="h-24 w-24 rounded-full border-4 border-[#F6E27A]/60 object-cover"
        />
        <h1
          className={`${headlineFont.className} mt-6 text-4xl text-[#F6E27A]`}
        >
          We&apos;ll miss you
        </h1>
        <p className="mt-1 text-lg text-white/80">{recipientName}</p>

        <div className="mt-10 flex max-w-xl flex-wrap items-center justify-center gap-x-6 gap-y-4">
          {messages.map((m) => (
            <span key={m.id} style={styleForName(m.id)} className="text-2xl">
              {m.authorName}
            </span>
          ))}
        </div>
      </section>

      {/* Messages flow together, packing as many as fit per page */}
      <section className="px-10 py-10" style={{ background: PRINT_BG }}>
        {messages.map((m) => (
          <div key={m.id} className="print-message mb-10">
            <h2 style={styleForName(m.id)} className="text-2xl">
              {m.authorName}
            </h2>
            <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-white/90">
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
                    className="h-28 w-28 rounded-lg object-cover"
                  />
                ))}
              </div>
            )}
          </div>
        ))}
      </section>
    </div>
  );
}
