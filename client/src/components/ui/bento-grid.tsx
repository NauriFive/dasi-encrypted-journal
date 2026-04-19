import { buttonVariants } from "@/components/ui/button";
import { cn } from "../../lib/utils";
import {
  ArrowRightIcon,
  ShieldCheckIcon,
  ZapIcon,
  PenToolIcon,
  CloudIcon,
} from "lucide-react";

export const CARDS = [
  {
    Icon: ShieldCheckIcon,
    name: "Always Private",
    description:
      "End-to-End Encryption. Your notes are encrypted before they even leave your device. Your eyes only, literally.",
    href: "#",
    cta: "Learn about privacy",
    className: "col-span-3 lg:col-span-2",
  },
  {
    Icon: PenToolIcon,
    name: "Distraction-Free",
    description:
      "A minimalist writing environment designed to help you focus on your thoughts, not the UI.",
    href: "#",
    cta: "Explore the editor",
    className: "col-span-3 lg:col-span-1",
  },
  {
    Icon: ZapIcon,
    name: "Fast & Powerful",
    description:
      "Instant search, full markdown support, and a responsive experience that keeps up with your mind.",
    href: "#",
    cta: "See all features",
    className: "col-span-3 lg:col-span-1",
  },
  {
    Icon: CloudIcon,
    name: "Secure Sync",
    description:
      "Access your journal from any device. Your data stays synced and secure wherever you go.",
    href: "#",
    cta: "Download the app",
    className: "col-span-3 lg:col-span-2",
  },
];

const BentoGrid = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "grid w-full grid-cols-3 gap-4",
        className
      )}
    >
      {children}
    </div>
  );
};

const BentoCard = ({
  name,
  className,
  Icon,
  description,
  href,
  cta,
}: {
  name: string;
  className: string;
  background?: ReactNode;
  Icon: any;
  description: string;
  href: string;
  cta: string;
}) => (
  <div
    key={name}
    className={cn(
      "group relative col-span-3 flex flex-col justify-between overflow-hidden rounded-[2.5rem] h-80",
      "bg-linear-to-br from-card to-card/95 shadow-2xl border-none",
      "hover:shadow-3xl hover:-rotate-1",
      "transition-all duration-500",
      className
    )}
  >
    <div className="pointer-events-none z-10 flex flex-col gap-2 p-10 transition-all duration-300 group-hover:-translate-y-2">
      <div className="bg-primary/10 w-fit p-4 rounded-2xl transition-colors duration-300 group-hover:bg-primary/20">
        <Icon className="h-10 w-10 text-primary transition-all duration-300 ease-in-out" />
      </div>
      <h3 className="text-3xl font-heading text-foreground mt-4">{name}</h3>
      <p className="max-w-lg text-muted-foreground leading-relaxed font-heading text-lg opacity-80">{description}</p>
    </div>

    <div
      className={cn(
        "absolute bottom-0 flex w-full translate-y-10 flex-row items-center p-10 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"
      )}
    >
      <a
        href={href}
        className={buttonVariants({
          size: "sm",
          variant: "link",
          className: "cursor-pointer text-primary p-0 h-auto text-lg font-bold underline decoration-2 underline-offset-4",
        })}
      >
        {cta}
        <ArrowRightIcon className="ml-2 h-5 w-5" />
      </a>
    </div>
  </div>
);

export { BentoCard, BentoGrid };
