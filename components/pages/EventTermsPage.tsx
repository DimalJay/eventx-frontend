"use client";

import Logo from "../widgets/Logo";

const sections = [
  {
    title: "1. Acceptance of Terms",
    content:
      "By accessing or using EventX, you agree to comply with and be bound by these Terms and Conditions. If you do not agree with any part of these terms, you should not use the platform.",
  },
  {
    title: "2. User Accounts",
    content:
      "Users are responsible for maintaining the confidentiality of their account credentials and for all activities conducted under their account.",
  },
  {
    title: "3. Event Registration",
    content:
      "Event registrations are subject to availability and any requirements specified by the event organizer. EventX reserves the right to reject or cancel registrations when necessary.",
  },
  {
    title: "4. Payments and Refunds",
    content:
      "Payments made through the platform are subject to the event organizer's policies. Refund eligibility and processing are determined by the organizer.",
  },
  {
    title: "5. User Conduct",
    content:
      "Users must not misuse the platform, attempt unauthorized access, distribute harmful content, or engage in activities that disrupt platform operations.",
  },
  {
    title: "6. Intellectual Property",
    content:
      "All platform content, branding, designs, and software are the property of EventX or its licensors and may not be copied or redistributed without permission.",
  },
  {
    title: "7. Limitation of Liability",
    content:
      "EventX shall not be liable for indirect, incidental, or consequential damages resulting from the use of the platform or participation in events.",
  },
  {
    title: "8. Privacy",
    content:
      "User information is collected and processed according to the EventX Privacy Policy.",
  },
  {
    title: "9. Termination",
    content:
      "EventX reserves the right to suspend or terminate user accounts that violate these Terms and Conditions.",
  },
  {
    title: "10. Changes to Terms",
    content:
      "These Terms and Conditions may be updated periodically. Continued use of the platform after updates constitutes acceptance of the revised terms.",
  },
];

export default function EventTermsPage() {
  return (
    <div className="relative flex flex-1 justify-center overflow-hidden bg-[#f5f1ea]">
      {/* Background Effects */}
      <div className="absolute -left-24 top-10 h-52 w-52 rounded-full bg-[#ffc9a7] opacity-35 blur-3xl" />
      <div className="absolute right-8 top-16 h-64 w-64 rounded-full bg-[#9fd3ff] opacity-35 blur-3xl" />
      <div className="absolute bottom-10 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-[#ffe8a3] opacity-40 blur-3xl" />

      <main className="relative w-full max-w-5xl px-8 py-16">
        {/* Header */}
        <header className="mb-12">
          <div className="flex items-center gap-3">
            <Logo />

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-black/50">
                EventX Legal
              </p>

              <h1 className="text-5xl font-semibold tracking-tight text-black">
                Terms & Conditions
              </h1>
            </div>
          </div>

          <p className="mt-6 max-w-3xl text-base leading-7 text-black/70">
            These Terms and Conditions govern your use of the EventX platform
            and the services provided through our event management system.
          </p>

          <p className="mt-4 text-sm text-black/50">
            Last Updated: June 2026
          </p>
        </header>

        {/* Terms Content */}
        <div className="space-y-6">
          {sections.map((section) => (
            <section
              key={section.title}
              className="rounded-3xl border border-black/10 bg-white/80 p-8 backdrop-blur-sm"
            >
              <h2 className="mb-4 text-2xl font-semibold text-black">
                {section.title}
              </h2>

              <p className="leading-8 text-black/70">
                {section.content}
              </p>
            </section>
          ))}
        </div>

        {/* Footer CTA */}
        <section className="mt-10 rounded-3xl bg-black p-8 text-white">
          <h2 className="text-3xl font-semibold">
            Need Clarification?
          </h2>

          <p className="mt-3 max-w-2xl text-white/70">
            If you have questions regarding these Terms and Conditions,
            please contact our support team for assistance.
          </p>

          <button className="mt-6 rounded-full bg-white px-6 py-3 font-semibold text-black transition hover:scale-[1.02]">
            Contact Support
          </button>
        </section>
      </main>
    </div>
  );
}