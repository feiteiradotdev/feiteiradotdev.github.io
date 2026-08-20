"use client"

import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import emailjs from "@emailjs/browser"
import { useState, useRef } from "react"
import { useTranslations } from "next-intl"
import Image from "next/image"
import { toast } from "sonner"
import { CONTACT_FORM } from "../../../lib/constants"

export default function Contact() {
  const t = useTranslations("contact")

  return (
    <div id="contact" className="section-spacing scroll-mt-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto mb-10">
        <span className="section-eyebrow">{t("title")}</span>
      </div>
      <div className="flex flex-col gap-8 max-w-5xl mx-auto py-4 md:grid md:grid-cols-2 md:gap-8">
        <div className="order-1 md:order-none">
          <ContactInfo />
        </div>
        <div className="order-2 md:order-none">
          <ContactForm />
        </div>
      </div>
    </div>
  )
}

function ContactForm() {
  const t = useTranslations("contact")
  const [form, setForm] = useState({ name: "", email: "", message: "", website: "" })
  const [errors, setErrors] = useState<{ name?: string; email?: string; message?: string }>({})
  const [loading, setLoading] = useState(false)
  const [lastSubmitTime, setLastSubmitTime] = useState(0)
  const statusRef = useRef<HTMLDivElement>(null)
  const emailJsServiceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID
  const emailJsTemplateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID
  const emailJsPublicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm((currentForm) => ({ ...currentForm, [name]: value }))

    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors((currentErrors) => ({ ...currentErrors, [name]: undefined }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: { name?: string; email?: string; message?: string } = {}

    if (!form.name.trim()) {
      newErrors.name = t("validation.nameRequired")
    } else if (form.name.trim().length < CONTACT_FORM.minNameLength) {
      newErrors.name = t("validation.nameMinLength", { min: CONTACT_FORM.minNameLength })
    } else if (form.name.trim().length > CONTACT_FORM.maxNameLength) {
      newErrors.name = t("validation.nameMaxLength", { max: CONTACT_FORM.maxNameLength })
    }

    if (!form.email.trim()) {
      newErrors.email = t("validation.emailRequired")
    } else if (!validateEmail(form.email)) {
      newErrors.email = t("validation.emailInvalid")
    }

    if (!form.message.trim()) {
      newErrors.message = t("validation.messageRequired")
    } else if (form.message.trim().length < CONTACT_FORM.minMessageLength) {
      newErrors.message = t("validation.messageMinLength", { min: CONTACT_FORM.minMessageLength })
    } else if (form.message.trim().length > CONTACT_FORM.maxMessageLength) {
      newErrors.message = t("validation.messageMaxLength", { max: CONTACT_FORM.maxMessageLength })
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!emailJsServiceId || !emailJsTemplateId || !emailJsPublicKey) {
      toast.error(t("toast.genericError"))
      if (statusRef.current) {
        statusRef.current.textContent = t("status.failed")
      }
      return
    }

    // Client-side rate limiting (prevent spam)
    const now = Date.now()
    const timeSinceLastSubmit = now - lastSubmitTime
    if (timeSinceLastSubmit < CONTACT_FORM.rateLimitWindow) {
      toast.error(t("toast.rateLimited"))
      return
    }

    if (!validateForm()) {
      toast.error(t("toast.formErrors"))
      return
    }

    if (form.website.trim()) {
      return
    }

    setLoading(true)
    if (statusRef.current) {
      statusRef.current.textContent = t("status.sending")
    }

    try {
      await emailjs.send(
        emailJsServiceId,
        emailJsTemplateId,
        {
          from_name: form.name.trim(),
          from_email: form.email.trim(),
          message: form.message.trim(),
        },
        { publicKey: emailJsPublicKey }
      )

      toast.success(t("toast.success"))
      setForm({ name: "", email: "", message: "", website: "" })
      setErrors({})
      setLastSubmitTime(Date.now())
      if (statusRef.current) {
        statusRef.current.textContent = t("status.sent")
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : t("toast.genericError")
      toast.error(errorMessage)
      if (statusRef.current) {
        statusRef.current.textContent = t("status.failed")
      }
    } finally {
      setLoading(false)
    }
  }

  const maxMessageLength = CONTACT_FORM.maxMessageLength
  const messageLength = form.message.length

  return (
    <div>
      <span className="text-3xl font-semibold block text-center md:text-left">
        {t("sendMessage")}
      </span>
      <div
        ref={statusRef}
        className="sr-only"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      />
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 my-5" noValidate>
        {/* Honeypot field - hidden from users */}
        <input
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          value={form.website}
          onChange={handleChange}
          style={{ position: "absolute", left: "-9999px" }}
          aria-hidden="true"
        />
        <div>
          <Input
            name="name"
            placeholder={t("form.namePlaceholder")}
            className={`w-full ${errors.name ? "border-destructive focus-visible:ring-destructive" : ""}`}
            value={form.name}
            onChange={handleChange}
            aria-invalid={errors.name ? "true" : "false"}
            aria-describedby={errors.name ? "name-error" : undefined}
            disabled={loading}
            required
          />
          {errors.name && (
            <p id="name-error" className="text-sm text-destructive mt-1" role="alert">
              {errors.name}
            </p>
          )}
        </div>

        <div>
          <Input
            name="email"
            type="email"
            placeholder={t("form.emailPlaceholder")}
            className={`w-full ${errors.email ? "border-destructive focus-visible:ring-destructive" : ""}`}
            value={form.email}
            onChange={handleChange}
            aria-invalid={errors.email ? "true" : "false"}
            aria-describedby={errors.email ? "email-error" : undefined}
            disabled={loading}
            required
          />
          {errors.email && (
            <p id="email-error" className="text-sm text-destructive mt-1" role="alert">
              {errors.email}
            </p>
          )}
        </div>

        <div>
          <Textarea
            name="message"
            placeholder={t("form.messagePlaceholder")}
            className={`resize-none h-40 ${errors.message ? "border-destructive focus-visible:ring-destructive" : ""}`}
            value={form.message}
            onChange={handleChange}
            maxLength={maxMessageLength}
            aria-invalid={errors.message ? "true" : "false"}
            aria-describedby={errors.message ? "message-error message-counter" : "message-counter"}
            disabled={loading}
            required
          />
          <div className="flex justify-between items-center mt-1">
            {errors.message ? (
              <p id="message-error" className="text-sm text-destructive" role="alert">
                {errors.message}
              </p>
            ) : (
              <span className="text-sm text-muted-foreground" id="message-counter">
                {t("form.characters", { count: messageLength, max: maxMessageLength })}
              </span>
            )}
          </div>
        </div>

        <Button type="submit" disabled={loading} aria-busy={loading}>
          {loading ? t("form.sending") : t("form.sendButton")}
        </Button>
      </form>
    </div>
  )
}

const contacts = [
  { icon: "email", href: "pedrofeiteira.dev@gmail.com" },
  { icon: "linkedin", href: "linkedin.com/in/feiteiradotdev" },
  { icon: "github", href: "github.com/feiteiradotdev" },
  { icon: "x", href: "x.com/feiteira_dev" },
]

function ContactInfo() {
  const t = useTranslations("contact")

  return (
    <div className="flex flex-col gap-2 space-y-4">
      <h2 className="text-3xl font-semibold text-center md:text-left">{t("getInTouch")}</h2>
      {contacts.map((contact, index) => (
        <div key={index} className="flex items-center gap-4">
          <Image
            src={`/icons/${contact.icon.toLowerCase()}.svg`}
            alt={`${contact.icon} icon`}
            width={35}
            height={35}
            className="dark:invert"
          />
          <span className="text-md">{contact.href}</span>
        </div>
      ))}
    </div>
  )
}
