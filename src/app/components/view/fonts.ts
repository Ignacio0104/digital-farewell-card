import {
  Caveat,
  Dancing_Script,
  Pacifico,
  Kalam,
  Shadows_Into_Light,
  Satisfy,
  Cinzel_Decorative,
} from "next/font/google";

import localFont from "next/font/local";

const caveat = Caveat({ subsets: ["latin"] });
const dancingScript = Dancing_Script({ subsets: ["latin"] });
export const pacifico = Pacifico({ subsets: ["latin"], weight: "400" });
export const kalam = Kalam({ subsets: ["latin"], weight: ["400", "700"] });
export const shadowsIntoLight = Shadows_Into_Light({
  subsets: ["latin"],
  weight: "400",
});
const satisfy = Satisfy({ subsets: ["latin"], weight: "400" });

export const headlineFont = localFont({
  src: "../../../../public/assets/fonts/waltograph/waltographUI.ttf",
  weight: "700", // match whatever weight your specific .ttf file actually is
});

export const monimerSerif = localFont({
  src: "../../../../public/assets/fonts/monimer_serif/MonimerSerif.otf",
  weight: "700", // match whatever weight your specific .ttf file actually is
});

export const cinzel = Cinzel_Decorative({
  subsets: ["latin"],
  weight: ["700", "900"],
});
const HANDWRITTEN_FONTS = [
  caveat,
  dancingScript,
  pacifico,
  kalam,
  shadowsIntoLight,
  satisfy,
];

const INK_COLORS = [
  "#e46ac5", // antique gold
  "#2F6F62", // deep emerald
  "#7A2E4A", // wine burgundy
  "#3C5B8C", // sapphire blue
  "#6B4C8A", // deep amethyst
  "#B5652B", // burnished copper
];

function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

// Deterministic per-id styling so server and client render the same thing
// (avoids hydration mismatches that plain Math.random() would cause).
export function styleForName(id: string) {
  const hash = hashString(id);
  const font = HANDWRITTEN_FONTS[hash % HANDWRITTEN_FONTS.length];
  const color =
    INK_COLORS[Math.floor(hash / HANDWRITTEN_FONTS.length) % INK_COLORS.length];
  const rotate = (hash % 13) - 6; // -6..6 deg
  const lift = ((hash >> 3) % 11) - 5; // -5..5 px

  return {
    fontFamily: font.style.fontFamily,
    color,
    transform: `rotate(${rotate}deg) translateY(${lift}px)`,
  } as const;
}

const PRINT_INK_COLORS = [
  "#6B3FA0", // deep amethyst
  "#2E6B4F", // forest green
  "#9C3D54", // maroon rose
  "#1F3A63", // ink navy
  "#8A5A22", // bronze
  "#4A3B78", // twilight violet
];

// Same deterministic hashing as styleForName, but darker colors and gentler
// rotation so it stays legible on white paper.
export function printStyleForName(id: string) {
  const hash = hashString(id);
  const font = HANDWRITTEN_FONTS[hash % HANDWRITTEN_FONTS.length];
  const color =
    PRINT_INK_COLORS[
      Math.floor(hash / HANDWRITTEN_FONTS.length) % PRINT_INK_COLORS.length
    ];
  const rotate = (hash % 9) - 4;

  return {
    fontFamily: font.style.fontFamily,
    color,
    transform: `rotate(${rotate}deg)`,
  } as const;
}
