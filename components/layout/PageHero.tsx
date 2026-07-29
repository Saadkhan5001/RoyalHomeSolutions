import Image from "next/image";
import Button from "@/components/ui/Button";

interface PageHeroProps {
  /** Small pill above the heading. */
  eyebrow: string;
  title: string;
  subtitle: string;
  image: string;
  imageAlt: string;
  cta?: { label: string; href: string };
}

/**
 * Shared hero for interior pages. Shorter than the homepage and seller-page
 * heroes — those are full-screen because they carry a conversion action; these
 * sit above real content, so the content should start above the fold.
 */
export default function PageHero({
  eyebrow,
  title,
  subtitle,
  image,
  imageAlt,
  cta,
}: PageHeroProps) {
  return (
    <section className="relative overflow-hidden">
      <Image
        src={image}
        alt={imageAlt}
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div
        className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/65 to-black/50"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto max-w-8xl px-6 pb-16 pt-32 sm:pb-20 sm:pt-36 lg:px-10 lg:pb-24 lg:pt-40">
        <p className="mb-4 inline-flex rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur-sm">
          {eyebrow}
        </p>
        <h1 className="max-w-3xl text-4xl font-semibold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-6xl">
          {title}
        </h1>
        <p className="mt-6 max-w-xl text-base leading-relaxed text-white/85 sm:text-lg">
          {subtitle}
        </p>
        {cta && (
          <div className="mt-8">
            <Button href={cta.href} variant="yellow" withArrow>
              {cta.label}
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
