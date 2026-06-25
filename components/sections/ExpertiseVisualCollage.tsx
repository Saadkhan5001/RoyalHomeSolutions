import Image from "next/image";

/**
 * Premium multi-photo collage of Jonah Stevens for the "Why choose" section.
 * Files live in /public/Assets/Images (spaces URL-encoded).
 */
const photos = {
  // Studio black-suit headshot — the polished anchor image.
  headshot: {
    src: "/Assets/Images/Jonah%20Stevens%204.jpg",
    alt: "Jonah Stevens, founder of Royal Home Solutions, in a black suit",
  },
  // Gray-suit conference photo — public-facing credibility.
  conference: {
    src: "/Assets/Images/Jonah%20Stevens%201.jpeg",
    alt: "Jonah Stevens at an industry conference",
  },
  // Pink shirt inside a bright home — hands-on property walkthroughs.
  interior: {
    src: "/Assets/Images/Jonah%20Stevens%202.jpeg",
    alt: "Jonah Stevens walking through a bright property interior",
  },
  // Signing paperwork with a client — real transaction work and trust.
  paperwork: {
    src: "/Assets/Images/Jonah%20Stevens%203.jpeg",
    alt: "Jonah Stevens reviewing and signing paperwork with a client",
  },
};

function Label({ className = "" }: { className?: string }) {
  return (
    <div
      className={`bg-gradient-to-t from-black/80 via-black/35 to-transparent ${className}`}
    >
      <p className="text-base font-semibold text-white">Jonah Stevens</p>
      <p className="mt-0.5 text-xs text-white/80">
        Founder &amp; Owner · Real Estate Expert
      </p>
    </div>
  );
}

export default function ExpertiseVisualCollage() {
  return (
    <div className="relative mx-auto w-full max-w-md lg:mx-0 lg:max-w-none">
      {/* ---------- Desktop: layered collage ---------- */}
      <div className="relative hidden lg:block">
        {/* Soft yellow accent glow behind the collage */}
        <div
          className="absolute -left-6 -top-8 h-36 w-36 rounded-full bg-brand-yellow/30 blur-3xl"
          aria-hidden="true"
        />

        <div className="relative z-10 flex gap-4">
          {/* Primary anchor — conference */}
          <div className="relative aspect-[3/4] w-[56%] overflow-hidden rounded-3xl shadow-xl ring-1 ring-black/5">
            <Image
              src={photos.conference.src}
              alt={photos.conference.alt}
              fill
              sizes="(min-width: 1024px) 300px, 0px"
              className="object-cover object-[50%_20%]"
            />
            <Label className="absolute inset-x-0 bottom-0 p-5" />
          </div>

          {/* Right stack — headshot + paperwork */}
          <div className="flex w-[44%] flex-col gap-4">
            <div className="relative flex-1 overflow-hidden rounded-2xl shadow-lg ring-4 ring-white">
              <Image
                src={photos.headshot.src}
                alt={photos.headshot.alt}
                fill
                sizes="(min-width: 1024px) 230px, 0px"
                className="object-cover object-center"
              />
            </div>
            <div className="relative flex-1 overflow-hidden rounded-2xl shadow-lg ring-4 ring-white">
              <Image
                src={photos.paperwork.src}
                alt={photos.paperwork.alt}
                fill
                sizes="(min-width: 1024px) 230px, 0px"
                className="object-cover object-center"
              />
            </div>
          </div>
        </div>

        {/* Overlapping accent — interior walkthrough, at the seam for depth */}
        <div className="absolute left-[55%] top-1/2 z-20 aspect-[3/4] w-[30%] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl shadow-2xl ring-4 ring-white">
          <Image
            src={photos.interior.src}
            alt={photos.interior.alt}
            fill
            sizes="(min-width: 1024px) 160px, 0px"
            className="object-cover object-[40%_25%]"
          />
        </div>
      </div>

      {/* ---------- Mobile / tablet: clean simplified grid ---------- */}
      <div className="grid grid-cols-2 gap-3 lg:hidden">
        <div className="relative col-span-2 aspect-[16/10] overflow-hidden rounded-2xl shadow-md ring-1 ring-black/5">
          <Image
            src={photos.headshot.src}
            alt={photos.headshot.alt}
            fill
            sizes="(max-width: 1024px) 90vw, 0px"
            className="object-cover object-center"
          />
          <Label className="absolute inset-x-0 bottom-0 p-4" />
        </div>
        <div className="relative aspect-square overflow-hidden rounded-2xl shadow-md ring-1 ring-black/5">
          <Image
            src={photos.conference.src}
            alt={photos.conference.alt}
            fill
            sizes="(max-width: 1024px) 45vw, 0px"
            className="object-cover object-[50%_25%]"
          />
        </div>
        <div className="relative aspect-square overflow-hidden rounded-2xl shadow-md ring-1 ring-black/5">
          <Image
            src={photos.interior.src}
            alt={photos.interior.alt}
            fill
            sizes="(max-width: 1024px) 45vw, 0px"
            className="object-cover object-[40%_25%]"
          />
        </div>
        <div className="relative col-span-2 aspect-[16/9] overflow-hidden rounded-2xl shadow-md ring-1 ring-black/5">
          <Image
            src={photos.paperwork.src}
            alt={photos.paperwork.alt}
            fill
            sizes="(max-width: 1024px) 90vw, 0px"
            className="object-cover object-center"
          />
        </div>
      </div>
    </div>
  );
}
