"use client"
import Image from "next/image"
import Link from "next/link"
import { useTranslations, useLocale } from "next-intl"
import { Button } from "@/components/ui/button"
import { motion, Variants } from "framer-motion"

const TICKER_ITEMS = [
  "AI Products",
  "LLM Agents",
  "Web Apps",
  "RAG Systems",
  "Automation",
  "Rapid Prototyping",
  "Full-Stack",
  "Workflow AI",
  "AI Products",
  "LLM Agents",
  "Web Apps",
  "RAG Systems",
  "Automation",
  "Rapid Prototyping",
  "Full-Stack",
  "Workflow AI",
]

const GRAIN_SVG = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`

export default function Hero() {
  const t = useTranslations("hero")

  return (
    <div className="flex flex-col min-h-[100dvh]">
      {/* Full-viewport split: content left | portrait right */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-[3fr_2fr]">

        {/* Content column */}
        <div className="flex flex-col justify-center gap-7 px-6 pt-8 pb-6 md:py-0 md:pl-16 lg:pl-24 md:pr-8 text-center md:text-left order-2 md:order-1">
          <HeroName />

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="text-base sm:text-lg text-muted-foreground max-w-lg mx-auto md:mx-0 leading-relaxed"
          >
            {t("tagline")}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.75, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start mt-1"
          >
            <ContactButton />
            <ResumeButton />
          </motion.div>
        </div>

        {/* Portrait column */}
        <div className="relative flex items-center justify-center py-10 md:py-0 md:pr-12 lg:pr-20 order-1 md:order-2 overflow-hidden">
          {/* Very subtle radial tonal focus — barely perceptible */}
          <div
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 70% 55% at 55% 50%, hsl(0 0% 0% / 0.025), transparent)",
            }}
          />
          <FloatingPortrait alt={t("profileAlt")} />
        </div>
      </div>

      {/* Ticker strip */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.1 }}
        className="w-full border-t border-border/30 overflow-hidden py-3"
      >
        <div className="animate-ticker flex gap-10 whitespace-nowrap w-max">
          {TICKER_ITEMS.map((item, i) => (
            <span
              key={i}
              className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.18em] text-muted-foreground/60 select-none"
            >
              {item}
              <span className="ml-10 opacity-30">·</span>
            </span>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

function FloatingPortrait({ alt }: { alt: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.3, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
      className="relative flex items-center justify-center"
    >
      {/* Float loop — wraps both ring and portrait so they move together */}
      <motion.div
        animate={{ y: [0, -16, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="relative"
      >
        {/* Outer decorative ring — extends 20px beyond the portrait */}
        <div
          aria-hidden="true"
          className="absolute rounded-full border border-border/20 pointer-events-none"
          style={{ inset: "-20px" }}
        />

        {/* Second, wider ring — very faint */}
        <div
          aria-hidden="true"
          className="absolute rounded-full border border-border/10 pointer-events-none"
          style={{ inset: "-40px" }}
        />

        {/* Portrait — pill/capsule shape via rounded-full on portrait-ratio container */}
        <div className="relative w-[190px] h-[270px] md:w-[290px] md:h-[414px] rounded-full overflow-hidden border border-border/35 shadow-[0_36px_90px_-24px_rgba(0,0,0,0.22)]">
          <Image
            src="/profile.jpeg"
            alt={alt}
            fill
            className="object-cover object-top grayscale"
            loading="eager"
            priority
            sizes="(max-width: 768px) 200px, 310px"
          />

          {/* Film grain texture */}
          <div
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none opacity-[0.045]"
            style={{
              backgroundImage: GRAIN_SVG,
              mixBlendMode: "overlay",
            }}
          />

          {/* Inner top edge refraction highlight */}
          <div
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none rounded-full shadow-[inset_0_1px_0_rgba(255,255,255,0.16)]"
          />

          {/* Very subtle bottom vignette */}
          <div
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 h-1/3 pointer-events-none"
            style={{
              background: "linear-gradient(to top, rgba(0,0,0,0.12), transparent)",
            }}
          />
        </div>
      </motion.div>
    </motion.div>
  )
}

function HeroName() {
  const t = useTranslations("hero")
  const fullName = t("greeting")

  const container: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  }

  const child: Variants = {
    hidden: { opacity: 0, y: 30, filter: "blur(8px)" },
    show: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const },
    },
  }

  return (
    <motion.h1
      variants={container}
      initial="hidden"
      animate="show"
      className="text-fluid-display font-semibold tracking-tighter leading-[0.9] break-words"
    >
      <div
        aria-live="polite"
        aria-atomic="true"
        className="flex flex-wrap justify-center md:justify-start overflow-hidden pb-4"
      >
        {fullName.split(" ").map((word, wordIndex) => (
          <div key={wordIndex} className="inline-flex mr-4 last:mr-0">
            <motion.span variants={child} className="inline-block">
              {word}
            </motion.span>
          </div>
        ))}
      </div>
      <motion.p variants={child}>
        <span className="font-mono text-sm md:text-base mt-4 md:mt-8 block font-medium text-muted-foreground tracking-[0.2em] uppercase">
          {t("role")}
        </span>
      </motion.p>
    </motion.h1>
  )
}

function ContactButton() {
  const t = useTranslations("hero")

  return (
    <Button
      onClick={() => {
        const contactSection = document.getElementById("contact")
        contactSection?.scrollIntoView({ behavior: "smooth" })
      }}
      className="w-full sm:w-auto cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
      aria-label={t("contactAriaLabel")}
    >
      {t("contactButton")}
    </Button>
  )
}

function ResumeButton() {
  const t = useTranslations("hero")
  const locale = useLocale()

  return (
    <Link
      href={`/${locale}/resume`}
      className="w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-md"
      aria-label={t("resumeAriaLabel")}
    >
      <Button
        variant="outline"
        className="w-full sm:w-auto cursor-pointer hover:bg-foreground hover:text-background"
      >
        {t("resumeButton")}
      </Button>
    </Link>
  )
}
