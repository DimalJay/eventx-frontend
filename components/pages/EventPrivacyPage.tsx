"use client";

import Logo from "../widgets/Logo";

const sections = [
  [
    "Introduction",
    "EventX is committed to protecting your privacy and ensuring your personal information is handled responsibly."
  ],
  [
    "Information We Collect",
    "We may collect personal information such as your name, email address, contact details, and event registration information."
  ],
  [
    "How We Use Information",
    "Collected information is used to manage events, registrations, notifications, and platform improvements."
  ],
  [
    "Data Security",
    "EventX uses appropriate security measures to protect user information from unauthorized access and misuse."
  ],
  [
    "Your Rights",
    "Users may request access, correction, or deletion of personal information where applicable."
  ],
  [
    "Policy Updates",
    "This policy may be updated periodically. Significant changes will be communicated through the platform."
  ],
];

export default function EventPrivacyPage() {
  return (
    <div className="relative flex flex-1 justify-center overflow-hidden bg-[#f5f1ea]">
      {/* Background */}
      <div className="absolute -left-24 top-10 h-52 w-52 rounded-full bg-[#ffc9a7] opacity-35 blur-3xl" />
      <div className="absolute right-8 top-16 h-64 w-64 rounded-full bg-[#9fd3ff] opacity-35 blur-3xl" />
      <div className="absolute bottom-10 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-[#ffe8a3] opacity-40 blur-3xl" />

      <main className="relative w-full max-w-5xl px-8 py-16">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3">
            <Logo />

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-black/50">
                EventX Legal
              </p>

              <h1 className="text-5xl font-semibold">
                Privacy Policy
              </h1>
            </div>
          </div>

          <p className="mt-6 max-w-2xl text-black/70">
            Learn how EventX collects, uses, and protects your personal information.
          </p>

          <p className="mt-4 text-sm text-black/50">
            Last Updated: June 2026
          </p>
        </div>

        {/* Policy Sections */}
        <div className="space-y-6">
          {sections.map(([title, content]) => (
            <div
              key={title}
              className="rounded-3xl border border-black/10 bg-white/80 p-8 backdrop-blur-sm"
            >
              <h2 className="mb-3 text-2xl font-semibold">
                {title}
              </h2>

              <p className="leading-8 text-black/70">
                {content}
              </p>
            </div>
          ))}
        </div>

        {/* Footer CTA */}
        <div className="mt-10 rounded-3xl bg-black p-8 text-white">
          <h2 className="text-3xl font-semibold">
            Questions About Privacy?
          </h2>

          <p className="mt-3 max-w-xl text-white/70">
            Contact our support team if you need clarification regarding our privacy practices.
          </p>

          <button className="mt-6 rounded-full bg-white px-6 py-3 font-semibold text-black">
            Contact Support
          </button>
        </div>
      </main>
    </div>
  );
}