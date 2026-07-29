import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

type ButtonVariant = "yellow" | "white" | "dark" | "ghost";

interface ButtonProps {
  children: React.ReactNode;
  href?: string;
  variant?: ButtonVariant;
  withArrow?: boolean;
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  /** Ignored when `href` is set — links have no disabled state. */
  disabled?: boolean;
  "aria-label"?: string;
}

const variantStyles: Record<ButtonVariant, string> = {
  yellow:
    "bg-brand-yellow text-brand-ink hover:bg-brand-yellow-dark shadow-sm",
  white: "bg-white text-brand-ink hover:bg-neutral-100 shadow-sm",
  dark: "bg-brand-ink text-white hover:bg-neutral-800",
  ghost: "bg-transparent text-brand-ink hover:bg-black/5",
};

/**
 * Pill-shaped CTA used across the site. Renders as a Link when `href` is
 * provided, otherwise as a native button.
 */
export default function Button({
  children,
  href,
  variant = "yellow",
  withArrow = false,
  className,
  onClick,
  type = "button",
  disabled = false,
  ...rest
}: ButtonProps) {
  const classes = cn(
    "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-yellow focus-visible:ring-offset-2",
    variantStyles[variant],
    disabled && "cursor-not-allowed opacity-60",
    className
  );

  const content = (
    <>
      {children}
      {withArrow && <ArrowRight className="h-4 w-4" aria-hidden="true" />}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={classes} {...rest}>
        {content}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={classes}
      {...rest}
    >
      {content}
    </button>
  );
}
