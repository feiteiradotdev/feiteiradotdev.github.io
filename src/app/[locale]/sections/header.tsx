"use client"

import * as React from "react"
import Link from "next/link"
import { useTranslations, useLocale } from "next-intl"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"

import { Moon, Sun, Menu } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"

import SocialMediaSection from "@/components/common/socialMedia"
import LanguageSwitcher from "@/components/LanguageSwitcher"

const PAGE_NAV_KEYS = ["about", "services", "skills", "showcase", "resume", "contact"] as const

export default function Header() {
  const [mobileNavOpen, setMobileNavOpen] = React.useState(false)
  const t = useTranslations("navigation")

  return (
    <>
      {/* Skip to main content link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
      >
        {t("skipToContent")}
      </a>
      <header
        id="home"
        className="sticky top-0 z-50 w-full px-4 py-4 bg-background/60 backdrop-blur-md border-b border-border/20 lg:grid lg:grid-cols-3 lg:gap-0 lg:px-6"
      >
        {/* Mobile Top Bar */}
        <div className="flex w-full items-center justify-between lg:hidden">
          <Home />
          <button
            aria-label={mobileNavOpen ? t("closeMenu") : t("openMenu")}
            aria-expanded={mobileNavOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMobileNavOpen((v) => !v)}
            className="p-2 rounded focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            <Menu className="h-5 w-5" strokeWidth={1.5} />
          </button>
        </div>
        {/* Desktop Layout */}
        <Home className="hidden lg:inline-flex" />
        <div className="hidden items-center justify-center lg:flex">
          <Navigation />
        </div>
        <div className="hidden items-center justify-end gap-4 lg:flex">
          <SocialMediaSection />
          <LanguageSwitcher />
          <DarkModeToggle />
        </div>
        {/* Mobile Dropdown */}
        {mobileNavOpen && (
          <nav
            id="mobile-navigation"
            aria-label={t("mobileNav")}
            className="absolute inset-x-0 top-full z-50 flex flex-col items-center gap-2 border-b bg-background py-4 shadow-lg transition-all duration-300 ease-in-out lg:hidden"
            style={{
              animation: mobileNavOpen ? "fadeInUp 0.3s ease-out" : undefined,
            }}
          >
            <Navigation mobile={true} />
            <div className="mt-4">
              <SocialMediaSection />
            </div>
            <div className="mt-2 flex gap-2">
              <LanguageSwitcher />
              <DarkModeToggle />
            </div>
          </nav>
        )}
      </header>
    </>
  )
}

function Home({ className = "inline-flex" }: { className?: string }) {
  const locale = useLocale()
  return (
    <Link
      href={`/${locale}`}
      className={`group items-baseline gap-0 ${className} focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded`}
      aria-label="Pedro Feiteira — home"
    >
      {/* Opening bracket — small mono, recedes visually */}
      <span className="font-mono text-[11px] text-muted-foreground/50 transition-all duration-300 ease-out group-hover:-translate-x-0.5 group-hover:text-foreground/70 select-none">
        &lt;
      </span>
      {/* Name — larger, bold, tight tracking — the visual anchor */}
      <span className="font-sans text-[15px] font-bold tracking-[-0.025em] text-foreground px-[3px] transition-colors duration-300">
        Pedro Feiteira
      </span>
      {/* Closing tag — mirrors opening bracket */}
      <span className="font-mono text-[11px] text-muted-foreground/50 transition-all duration-300 ease-out group-hover:translate-x-0.5 group-hover:text-foreground/70 select-none">
        /&gt;
      </span>
      {/* Blinking cursor — visible only on hover */}
      <span
        className="font-mono text-[10px] text-foreground/60 ml-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-150 select-none terminal-underscore"
        aria-hidden="true"
      >
        _
      </span>
    </Link>
  )
}

function Navigation({ mobile = false }: { mobile?: boolean }) {
  const t = useTranslations("navigation")
  const locale = useLocale()

  const navItems = PAGE_NAV_KEYS.map((key) => ({ title: t(key), href: `/${locale}/${key}`, key }))

  return (
    <nav aria-label={mobile ? t("mobileNav") : t("mainNav")}>
      <NavigationMenu
        className={`items-center ${mobile ? "flex flex-col gap-2" : ""}`}
        viewport={false}
      >
        <NavigationMenuList>
          <NavigationMenuItem>
            {navItems.map((component) => (
              <NavigationMenuLink
                asChild
                className={`${navigationMenuTriggerStyle()} bg-transparent hover:bg-transparent data-[state=open]:bg-transparent data-[active]:bg-transparent text-xs uppercase tracking-widest font-medium focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2`}
                key={component.key}
              >
                <Link
                  href={component.href}
                  aria-label={t("navigateTo", { section: component.title })}
                >
                  {component.title}
                </Link>
              </NavigationMenuLink>
            ))}
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </nav>
  )
}

function DarkModeToggle() {
  const { setTheme, theme } = useTheme()
  const t = useTranslations("navigation")

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
    >
      <Sun className="h-4 w-4 dark:hidden" strokeWidth={1.5} />
      <Moon className="hidden h-4 w-4 dark:block" strokeWidth={1.5} />
      <span className="sr-only">{t("toggleTheme")}</span>
    </Button>
  )
}
