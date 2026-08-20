import Link from "next/link"
import { Button } from "@/components/ui/button"
import Image from "next/image"

const socialMedia = [
  {"icon": "linkedin", "href": "https://www.linkedin.com/in/feiteiradotdev/"},
  {"icon": "github", "href": "https://github.com/feiteiradotdev"},
  {"icon": "x", "href": "https://x.com/feiteira_dev"},

]

export default function SocialMediaSection() {
  return (
    <div className="items-center" role="list" aria-label="Social media links">
      {socialMedia.map((media, index) => (
        <Button
          key={index}
          variant="ghost"
          size="icon"
          className="hover:text-primary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          asChild
          aria-label={`Visit my ${media.icon} profile`}
        >
          <Link href={media.href} className="flex items-center" target="_blank" rel="noopener noreferrer">
            <Image
              src={`/icons/${media.icon.toLowerCase()}.svg`}
              alt=""
              className="h-5 w-5 dark:invert"
              width={50}
              height={50}
              aria-hidden="true"
            />
            <span className="sr-only">{media.icon}</span>
          </Link>
        </Button>
      ))}
    </div>
  )
}