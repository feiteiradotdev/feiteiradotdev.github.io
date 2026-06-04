"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { useLocale, useTranslations } from "next-intl"
import { motion, type Variants } from "framer-motion"
import {
  Download,
  Printer,
  ArrowLeft,
  Mail,
  MapPin,
  Globe,
  Calendar,
  GraduationCap,
} from "lucide-react"

import Header from "../sections/header"
import Footer from "../sections/footer"
import { Button } from "@/components/ui/button"

/* -------------------------------------------------------------------------- */
/*  Types                                                                     */
/* -------------------------------------------------------------------------- */

type ExperienceEntry = {
  role: string
  company: string
  period: string
  location: string
  description: string[]
  technologies: string[]
}

type SkillGroup = { label: string; items: string[] }
type EducationEntry = {
  degree: string
  school: string
  period: string
  location: string
  detail: string
}
type LanguageEntry = { name: string; level: string; value: number }

/* -------------------------------------------------------------------------- */
/*  Contact details                                                           */
/* -------------------------------------------------------------------------- */

const CONTACT = {
  email: "pedrofeiteira.dev@gmail.com",
  website: "https://p-feiteira.github.io/",
  websiteLabel: "p-feiteira.github.io",
  linkedin: "https://www.linkedin.com/in/feiteira-dev",
  linkedinLabel: "in/feiteira-dev",
  github: "https://github.com/feiteira-dev",
  githubLabel: "feiteira-dev",
}

/* -------------------------------------------------------------------------- */
/*  Motion helpers (whileInView; the print stylesheet forces full opacity)    */
/* -------------------------------------------------------------------------- */

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
}

function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode
  className?: string
  delay?: number
}) {
  return (
    <motion.div
      className={className}
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-8%" }}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  )
}

/* -------------------------------------------------------------------------- */
/*  Page                                                                      */
/* -------------------------------------------------------------------------- */

export default function ResumeClient() {
  const t = useTranslations("resume")
  const tExp = useTranslations("experience")
  const locale = useLocale()

  const experience = tExp.raw("entries") as ExperienceEntry[]
  const skillGroups = t.raw("skillGroups") as SkillGroup[]
  const education = t.raw("education") as EducationEntry[]
  const languages = t.raw("languagesList") as LanguageEntry[]

  const handleDownload = React.useCallback(() => {
    window.print()
  }, [])

  return (
    <div className="min-h-screen">
      <div className="no-print">
        <Header />
      </div>

      <main id="main-content" className="px-4 pb-24 pt-10 sm:px-6">
        {/* Action bar (excluded from the printed document) */}
        <div className="no-print mx-auto mb-8 flex w-full max-w-3xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href={`/${locale}`}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded"
          >
            <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
            {t("backToHome")}
          </Link>

          <div className="flex items-center gap-3">
            <Button
              onClick={handleDownload}
              className="cursor-pointer gap-2"
              title={t("downloadHint")}
              aria-label={t("download")}
            >
              <Download className="h-4 w-4" strokeWidth={1.75} />
              {t("download")}
            </Button>
            <Button
              variant="outline"
              onClick={() => window.print()}
              className="cursor-pointer gap-2"
              aria-label={t("print")}
            >
              <Printer className="h-4 w-4" strokeWidth={1.75} />
              <span className="hidden sm:inline">{t("print")}</span>
            </Button>
          </div>
        </div>

        <p className="no-print mx-auto mb-6 max-w-3xl text-center text-xs text-muted-foreground/70">
          {t("downloadHint")}
        </p>

        {/* The printable résumé document */}
        <article className="resume-sheet mx-auto w-full max-w-3xl rounded-xl border border-border/60 bg-card/70 p-7 shadow-[0_30px_80px_-40px_rgba(0,0,0,0.35)] backdrop-blur-sm sm:p-10 md:p-12">
          <Masthead />
          <Profile />
          <ExperienceSection entries={experience} ongoing={tExp("ongoing")} />
          <TechStack groups={skillGroups} />
          <div className="mt-10 grid gap-10 sm:grid-cols-2">
            <EducationSection entries={education} />
            <LanguagesSection languages={languages} />
          </div>
        </article>
      </main>

      <div className="no-print">
        <Footer />
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*  Masthead — name, role, contact                                            */
/* -------------------------------------------------------------------------- */

function Masthead() {
  const t = useTranslations("resume")

  const contacts: Array<{
    icon?: typeof Mail
    svg?: string
    label: string
    href?: string
  }> = [
    { icon: Mail, label: CONTACT.email, href: `mailto:${CONTACT.email}` },
    { icon: MapPin, label: t("location") },
    { icon: Globe, label: CONTACT.websiteLabel, href: CONTACT.website },
    { svg: "linkedin", label: CONTACT.linkedinLabel, href: CONTACT.linkedin },
    { svg: "github", label: CONTACT.githubLabel, href: CONTACT.github },
  ]

  return (
    <header className="resume-avoid-break">
      <Reveal>
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Pedro Feiteira
          </h1>
          <p className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground sm:text-sm">
            {t("role")}
          </p>
        </div>

        <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
          {contacts.map((c) => {
            const Icon = c.icon
            const content = (
              <span className="inline-flex items-center gap-1.5">
                {Icon ? (
                  <Icon className="h-3.5 w-3.5 flex-shrink-0" strokeWidth={1.5} />
                ) : (
                  <Image
                    src={`/icons/${c.svg}.svg`}
                    alt=""
                    width={14}
                    height={14}
                    aria-hidden="true"
                    className="h-3.5 w-3.5 flex-shrink-0 opacity-80 dark:invert"
                  />
                )}
                {c.label}
              </span>
            )
            return (
              <li key={c.label}>
                {c.href ? (
                  <a
                    href={c.href}
                    target={c.href.startsWith("http") ? "_blank" : undefined}
                    rel={c.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="transition-colors hover:text-foreground"
                  >
                    {content}
                  </a>
                ) : (
                  content
                )}
              </li>
            )
          })}
        </ul>
      </Reveal>

      <div className="mt-7 h-px w-full bg-border" />
    </header>
  )
}

/* -------------------------------------------------------------------------- */
/*  Section heading                                                           */
/* -------------------------------------------------------------------------- */

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-5 font-mono text-xs font-semibold uppercase tracking-[0.2em] text-foreground/70">
      {children}
    </h2>
  )
}

/* -------------------------------------------------------------------------- */
/*  Profile / summary                                                         */
/* -------------------------------------------------------------------------- */

function Profile() {
  const t = useTranslations("resume")
  return (
    <section className="mt-7 resume-avoid-break">
      <Reveal>
        <SectionHeading>{t("summaryTitle")}</SectionHeading>
        <p className="max-w-prose text-sm leading-relaxed text-muted-foreground">
          {t("summary")}
        </p>
      </Reveal>
    </section>
  )
}

/* -------------------------------------------------------------------------- */
/*  Experience                                                                */
/* -------------------------------------------------------------------------- */

function ExperienceSection({
  entries,
  ongoing,
}: {
  entries: ExperienceEntry[]
  ongoing: string
}) {
  const t = useTranslations("resume")
  return (
    <section className="mt-10">
      <Reveal>
        <SectionHeading>{t("sections.experience")}</SectionHeading>
      </Reveal>
      <div className="flex flex-col gap-7">
        {entries.map((entry, i) => (
          <Reveal key={`${entry.company}-${i}`} delay={i * 0.04}>
            <ExperienceItem entry={entry} ongoing={ongoing} />
          </Reveal>
        ))}
      </div>
    </section>
  )
}

function ExperienceItem({
  entry,
  ongoing,
}: {
  entry: ExperienceEntry
  ongoing: string
}) {
  const isOngoing = entry.period.toLowerCase().includes(ongoing.toLowerCase())

  return (
    <div className="resume-avoid-break border-l border-border/70 pl-5">
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <h3 className="text-base font-semibold text-foreground">{entry.role}</h3>
        <span className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wide text-muted-foreground">
          <Calendar className="h-3 w-3" strokeWidth={1.5} />
          {entry.period}
          {isOngoing && (
            <span
              aria-hidden="true"
              className="ml-1 inline-block h-1.5 w-1.5 rounded-full bg-emerald-500"
            />
          )}
        </span>
      </div>

      <div className="mt-0.5 flex flex-wrap items-center gap-x-3 text-sm text-muted-foreground">
        <span className="font-medium text-foreground/80">{entry.company}</span>
        <span className="inline-flex items-center gap-1">
          <MapPin className="h-3 w-3" strokeWidth={1.5} />
          {entry.location}
        </span>
      </div>

      <ul className="mt-3 space-y-1.5">
        {entry.description.map((line, i) => (
          <li
            key={i}
            className="flex items-start gap-2 text-sm leading-relaxed text-muted-foreground"
          >
            <span className="mt-[7px] h-1 w-1 flex-shrink-0 rounded-full bg-foreground/40" />
            <span>{line}</span>
          </li>
        ))}
      </ul>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {entry.technologies.map((tech) => (
          <span
            key={tech}
            className="rounded-full border border-border/60 px-2.5 py-0.5 font-mono text-[10.5px] text-muted-foreground"
          >
            {tech}
          </span>
        ))}
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*  Tech stack                                                                */
/* -------------------------------------------------------------------------- */

function TechStack({ groups }: { groups: SkillGroup[] }) {
  const t = useTranslations("resume")
  return (
    <section className="mt-10 resume-avoid-break">
      <Reveal>
        <SectionHeading>{t("sections.techStack")}</SectionHeading>
        <div className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
          {groups.map((group) => (
            <div key={group.label}>
              <p className="mb-2 text-[11px] font-medium uppercase tracking-wider text-muted-foreground/70">
                {group.label}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {group.items.map((item) => (
                  <span
                    key={item}
                    className="rounded-md border border-border/60 bg-muted/40 px-2.5 py-1 text-xs text-foreground/80"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  )
}

/* -------------------------------------------------------------------------- */
/*  Education                                                                 */
/* -------------------------------------------------------------------------- */

function EducationSection({ entries }: { entries: EducationEntry[] }) {
  const t = useTranslations("resume")
  return (
    <section className="resume-avoid-break">
      <Reveal>
        <SectionHeading>{t("sections.education")}</SectionHeading>
        <div className="flex flex-col gap-4">
          {entries.map((edu, i) => (
            <div key={i} className="flex gap-3">
              <GraduationCap
                className="mt-0.5 h-4 w-4 flex-shrink-0 text-muted-foreground"
                strokeWidth={1.5}
              />
              <div>
                <h3 className="text-sm font-semibold text-foreground">
                  {edu.degree}
                </h3>
                <p className="text-sm text-foreground/80">{edu.school}</p>
                <p className="mt-0.5 font-mono text-[11px] uppercase tracking-wide text-muted-foreground">
                  {edu.period} · {edu.location}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  {edu.detail}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  )
}

/* -------------------------------------------------------------------------- */
/*  Languages                                                                 */
/* -------------------------------------------------------------------------- */

function LanguagesSection({ languages }: { languages: LanguageEntry[] }) {
  const t = useTranslations("resume")
  return (
    <section className="resume-avoid-break">
      <Reveal>
        <SectionHeading>{t("sections.languages")}</SectionHeading>
        <div className="flex flex-col gap-4">
          {languages.map((lang) => (
            <div key={lang.name}>
              <div className="flex items-baseline justify-between">
                <span className="text-sm font-medium text-foreground">
                  {lang.name}
                </span>
                <span className="font-mono text-[11px] uppercase tracking-wide text-muted-foreground">
                  {lang.level}
                </span>
              </div>
              <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-muted">
                <motion.div
                  className="h-full rounded-full bg-foreground/70"
                  style={{ width: `${lang.value}%`, transformOrigin: "left" }}
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                />
              </div>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  )
}
