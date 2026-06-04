import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { ThemeProvider } from "./sections/components/theme-provider";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./sections/lib/queryClient";
import StructuredData from "./sections/components/StructuredData";
import { Toaster } from "sonner";
import { ErrorBoundary } from "./sections/components/ErrorBoundary";
import Analytics from "./sections/components/Analytics";
import Background from "./sections/components/common/Background";
import { NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { locales, type Locale } from "@i18n/config";
import { notFound } from "next/navigation";

// Import messages directly for static export
import enMessages from "../../messages/en.json";
import ptMessages from "../../messages/pt.json";

const messagesMap: Record<Locale, typeof enMessages> = {
  en: enMessages,
  pt: ptMessages,
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://feiteira-dev.github.io";

type Props = {
  params: Promise<{ locale: string }>;
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export function generateStaticParams() {
  // Generate all locales including English
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  const translations: Record<
    Locale,
    { title: string; description: string; ogLocale: string }
  > = {
    en: {
      title: "Pedro Feiteira - Inventor. Builder.",
      description:
        "Inventor and builder who turns ideas into products at the speed of imagination. AI collapsed the tech stack barriers — I build across any stack. Based in Portugal, remote ready.",
      ogLocale: "en_US",
    },
    pt: {
      title: "Pedro Feiteira - Inventor. Builder.",
      description:
        "Inventor e builder que transforma ideias em produtos a velocidade da imaginacao. A IA eliminou as barreiras de stack — construo em qualquer tecnologia. Baseado em Portugal, disponivel remotamente.",
      ogLocale: "pt_PT",
    },
  };

  const t = translations[locale as Locale] || translations.en;
  const canonicalPath = `/${locale}/`;

  return {
    title: t.title,
    description: t.description,
    keywords: [
      "Pedro Feiteira",
      "AI Product Development",
      "Full Stack Developer",
      "Portugal",
      "Python",
      "TypeScript",
      "React",
      "Next.js",
      "Web Developer",
      "Portfolio",
      "LLM",
      "AI Automation",
      "Rapid Prototyping",
    ],
    authors: [{ name: "Pedro Feiteira" }],
    creator: "Pedro Feiteira",
    metadataBase: new URL(siteUrl),
    alternates: {
      canonical: canonicalPath,
      languages: {
        en: "/en/",
        pt: "/pt/",
      },
    },
    openGraph: {
      title: t.title,
      description: t.description,
      url: `${siteUrl}${canonicalPath}`,
      siteName: "Pedro Feiteira Portfolio",
      images: [
        {
          url: "/profile.jpg",
          width: 1200,
          height: 630,
          alt: "Pedro Feiteira",
        },
      ],
      locale: t.ogLocale,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: t.title,
      description: t.description,
      images: ["/profile.jpg"],
      creator: "@feiteira_dev",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    icons: {
      icon: "/favicon.ico",
      apple: "/favicon.ico",
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  // Enable static rendering for this locale
  setRequestLocale(locale);

  const messages = messagesMap[locale as Locale] || messagesMap.en;

  return (
    <html lang={locale} suppressHydrationWarning className="scroll-smooth scroll-pt-24">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <StructuredData locale={locale} />
        <Analytics />
        <ErrorBoundary>
          <QueryClientProvider client={queryClient}>
            <NextIntlClientProvider messages={messages} locale={locale}>
              <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
              >
                <Background />
                {children}
                <Toaster position="top-center" richColors closeButton />
              </ThemeProvider>
            </NextIntlClientProvider>
          </QueryClientProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
