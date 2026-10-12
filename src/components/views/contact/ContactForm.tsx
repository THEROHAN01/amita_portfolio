"use client";

import { Check, Download, Send } from "lucide-react";
import { useState, type FormEvent } from "react";
import { profile } from "@/content/profile";
import s from "./contact.module.css";

const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

type Sent = { name: string; email: string };

/**
 * There is no mail backend, so a valid message is handed to the visitor's
 * email client as a pre-filled draft addressed to Amita.
 */
export function ContactForm() {
  const [error, setError] = useState("");
  const [sent, setSent] = useState<Sent | null>(null);

  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const field = (k: string) => String(data.get(k) ?? "").trim();
    const name = field("name");
    const email = field("email");
    const message = field("message");
    if (!name || !email || !message) return setError("Please fill in your name, email and message.");
    if (!EMAIL.test(email)) return setError("That email address does not look right.");
    setError("");
    const subject = encodeURIComponent(`Portfolio enquiry from ${name}`);
    const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);
    window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`;
    setSent({ name: name.split(" ")[0], email });
  }

  if (sent) {
    return (
      <div className={s.done} role="status">
        <span className={s.doneIcon}>
          <Check size={26} color="#fff" />
        </span>
        <h3 className={s.doneTitle}>Thanks, {sent.name}.</h3>
        <p className={s.doneBody}>
          Your email app should have opened with the message ready to send. Amita replies to {sent.email} within one
          working day — or write directly to {profile.email}.
        </p>
        <button type="button" className={s.ghost} onClick={() => setSent(null)}>
          Send another
        </button>
      </div>
    );
  }

  return (
    <form className={s.form} onSubmit={submit} noValidate>
      <div className={s.pair}>
        <label className={s.field}>
          <span>Name</span>
          <input name="name" type="text" autoComplete="name" placeholder="Full name" />
        </label>
        <label className={s.field}>
          <span>Email</span>
          <input name="email" type="email" autoComplete="email" placeholder="you@company.com" />
        </label>
      </div>
      <label className={`${s.field} ${s.grow}`}>
        <span>Message</span>
        <textarea name="message" placeholder="A few lines about the work and your timeline." />
      </label>
      <div className={s.actions}>
        {error ? (
          <span className={s.error} role="alert">
            {error}
          </span>
        ) : (
          <a href={profile.cv.href} download={profile.cv.file} className={s.cv}>
            <Download size={15} />
            Download resume
          </a>
        )}
        <button type="submit" className={s.submit}>
          <Send size={15} />
          Send message
        </button>
      </div>
    </form>
  );
}
