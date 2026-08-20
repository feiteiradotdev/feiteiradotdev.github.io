const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://feiteiradotdev.github.io";

interface StructuredDataProps {
  locale: string;
}

export default function StructuredData({ locale }: StructuredDataProps) {
  const jobTitles: Record<string, string> = {
    en: "Software Developer",
    pt: "Programador",
  };

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Pedro Feiteira",
    jobTitle: jobTitles[locale] || jobTitles.en,
    url: locale === "en" ? siteUrl : `${siteUrl}/${locale}/`,
    sameAs: [
      "https://github.com/feiteiradotdev",
      "https://www.linkedin.com/in/feiteiradotdev/",
      "https://x.com/feiteira_dev",
    ],
    email: "pedrofeiteira.dev@gmail.com",
    address: {
      "@type": "PostalAddress",
      addressCountry: "PT",
      addressLocality: "Portugal",
    },
    knowsAbout: [
      "Python",
      "TypeScript",
      "React",
      "Next.js",
      "SQL",
      "Docker",
      "CI/CD",
      "Software Development",
    ],
    inLanguage: locale,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
