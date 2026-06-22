"use client";

import { useState } from "react";
import { Loader2, CheckCircle2, Send } from "lucide-react";
import { whatsappLink } from "@/lib/constants";
import { WhatsAppIcon } from "@/components/brand/contact-icons";

export function ContactForm({
  propertyId,
  propertyTitle,
  source = "contact-page",
  compact = false,
}: {
  propertyId?: string;
  propertyTitle?: string;
  source?: string;
  compact?: boolean;
}) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle",
  );
  const [error, setError] = useState("");

  const defaultMessage = propertyTitle
    ? `Hi Islander Home, I'm interested in "${propertyTitle}". Please send me more details.`
    : "";

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setError("");
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          property_id: propertyId ?? null,
          property_title: propertyTitle ?? null,
          source,
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Something went wrong. Please try again.");
      }
      setStatus("success");
      form.reset();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Please try again.");
    }
  }

  if (status === "success") {
    return (
      <div className="flex flex-col items-center justify-center border border-gold/40 bg-charcoal p-10 text-center">
        <CheckCircle2 className="h-12 w-12 text-gold-dark" />
        <h3 className="mt-4 font-display text-2xl font-semibold text-paper">
          Thank you
        </h3>
        <p className="mt-2 max-w-sm text-sm text-paper/65">
          Your enquiry has been received. An Islander Home advisor will be in
          touch shortly. For an immediate response, message us on WhatsApp.
        </p>
        <a
          href={whatsappLink(defaultMessage || undefined)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex items-center gap-2 bg-[#25D366] px-6 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-white"
        >
          <WhatsAppIcon className="h-4 w-4" /> Chat on WhatsApp
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <div className={compact ? "" : "grid gap-4 sm:grid-cols-2"}>
        <Field label="Full name" name="name" required placeholder="Your name" />
        <Field
          label="Email"
          name="email"
          type="email"
          required
          placeholder="you@email.com"
        />
      </div>
      <Field
        label="Phone / WhatsApp"
        name="phone"
        placeholder="+66 …"
      />
      <label className="flex flex-col gap-1.5">
        <span className="text-xs font-medium uppercase tracking-[0.14em] text-paper/60">
          Message
        </span>
        <textarea
          name="message"
          rows={compact ? 3 : 4}
          defaultValue={defaultMessage}
          placeholder="Tell us what you're looking for…"
          className="border border-sand bg-ink px-4 py-3 text-sm text-paper outline-none placeholder:text-paper/30 focus:border-gold"
        />
      </label>

      {status === "error" && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="inline-flex h-13 items-center justify-center gap-2 bg-gold px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.18em] text-ink transition-colors hover:bg-gold-light disabled:opacity-60"
      >
        {status === "loading" ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Send className="h-4 w-4" />
        )}
        {status === "loading" ? "Sending…" : "Send Enquiry"}
      </button>
      <p className="text-center text-xs text-paper/45">
        By submitting you agree to be contacted by Islander Home Phuket.
      </p>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-medium uppercase tracking-[0.14em] text-paper/60">
        {label}
        {required && <span className="text-gold-dark"> *</span>}
      </span>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="h-12 border border-sand bg-ink px-4 text-sm text-paper outline-none placeholder:text-paper/30 focus:border-gold"
      />
    </label>
  );
}
