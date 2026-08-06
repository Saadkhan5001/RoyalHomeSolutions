import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          // Golden-yellow accent used for CTAs and icons
          yellow: "#F5CE3E",
          "yellow-dark": "#E9BF2A",
          // Trust / process green
          green: "#22A24B",
          "green-dark": "#1B8C3F",
          ink: "#0D0D0D",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      maxWidth: {
        "8xl": "88rem",
      },
      borderRadius: {
        "4xl": "2rem",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        // No opacity in this keyframe, by design — see the note on `reveal`
        // in `animation` below.
        reveal: {
          "0%": { transform: "translateY(-6px)" },
          "100%": { transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s ease-out both",
        // Used by the FAQ accordion, where an invisible panel would contradict
        // aria-expanded. Two deliberate properties make that impossible:
        //
        //   1. It animates transform only — never opacity, height or
        //      visibility. Content is fully readable at EVERY keyframe, so
        //      even if the animation freezes part-way (animations advance on
        //      the document timeline, which needs frames) the worst case is
        //      text sitting 6px high, not text that cannot be seen.
        //   2. No fill-mode, so outside the active duration the element uses
        //      its ordinary style.
        //
        // Contrast with `fade-up` above, which starts at opacity 0 and is fine
        // for scroll reveals but would be the wrong tool here.
        reveal: "reveal 0.25s ease-out",
      },
    },
  },
  plugins: [],
};

export default config;
