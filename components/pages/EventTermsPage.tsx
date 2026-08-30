"use client";

import { motion, useReducedMotion } from "framer-motion";

const sections = [
  {
    title: "1. Acceptance of Terms",
    content:
      "By accessing or using EventX, you agree to comply with and be bound by these Terms and Conditions. If you do not agree with any part of these terms, you should not use the platform. EventX reserves the right to modify these terms at any time, and your continued use of the platform following any modifications constitutes your acceptance of the updated terms.",
  },
  {
    title: "2. User Accounts and Registration",
    content:
      "Users are responsible for maintaining the confidentiality of their account credentials and for all activities conducted under their account. You must provide accurate, complete, and current information during registration. You agree to notify EventX immediately of any unauthorized use of your account. EventX shall not be liable for any loss or damage arising from your failure to protect your account information.",
  },
  {
    title: "3. Event Registration and Participation",
    content:
      "Event registrations are subject to availability and any requirements specified by the event organizer. EventX reserves the right to reject, cancel, or modify registrations when necessary. Registration does not guarantee admission if capacity is exceeded. Event organizers may impose additional terms, restrictions, or requirements for their specific events, which supersede these general terms for that event.",
  },
  {
    title: "4. Payments, Billing, and Refunds",
    content:
      "All payments made through the platform are processed securely and subject to the event organizer's pricing and refund policies. EventX acts as a payment facilitator and is not responsible for billing disputes between participants and organizers. Refund eligibility, timeframes, and processing procedures are determined solely by the event organizer. EventX fees are non-refundable. All prices are final unless otherwise stated by the organizer.",
  },
  {
    title: "5. User Conduct and Responsibilities",
    content:
      "Users must not misuse the platform, attempt unauthorized access, distribute harmful or offensive content, engage in harassment, spam, or phishing activities. You agree not to reverse engineer, decompile, or attempt to discover the platform's underlying systems. Violation of these conduct standards may result in immediate account suspension or termination without refund.",
  },
  {
    title: "6. Intellectual Property Rights",
    content:
      "All platform content, including branding, designs, logos, software, and documentation, are the exclusive property of EventX or its licensors. You may not copy, reproduce, distribute, modify, or create derivative works from any platform content without express written permission. Unauthorized use of EventX intellectual property is prohibited and may result in legal action.",
  },
  {
    title: "7. Limitation of Liability",
    content:
      "EventX shall not be liable for indirect, incidental, special, consequential, or punitive damages resulting from the use of the platform, participation in events, payment processing errors, or data loss. EventX's total liability for any claim shall not exceed the amount paid by the user in the preceding 12 months. Some jurisdictions do not allow limitation of liability; applicable laws will govern.",
  },
  {
    title: "8. Privacy and Data Protection",
    content:
      "User information is collected, processed, and protected according to the EventX Privacy Policy. By using the platform, you consent to our collection and use of personal data as outlined in the Privacy Policy. EventX complies with applicable data protection regulations including GDPR where applicable. Your data will not be shared with third parties without your consent, except as required by law or to facilitate event organization.",
  },
  {
    title: "9. Third-Party Services and Links",
    content:
      "EventX may integrate with third-party payment processors, event management tools, and other services. We are not responsible for the practices, policies, or performance of third-party services. Your use of third-party services is subject to their terms and conditions. EventX provides links to external websites for convenience only and does not endorse their content.",
  },
  {
    title: "10. Suspension and Termination",
    content:
      "EventX reserves the right to suspend or terminate user accounts that violate these Terms and Conditions or engage in unlawful activities. Termination may be immediate and without notice for serious violations. Upon termination, your rights to use the platform cease immediately. Provisions regarding intellectual property, limitations of liability, and dispute resolution survive termination.",
  },
  {
    title: "11. Disclaimer of Warranties",
    content:
      "The platform is provided 'as is' and 'as available' without warranties of any kind, express or implied. EventX does not warrant that the platform will be uninterrupted, error-free, secure, or that defects will be corrected. EventX disclaims all warranties including merchantability, fitness for a particular purpose, and non-infringement.",
  },
  {
    title: "12. Changes to Terms and Services",
    content:
      "EventX may update or modify these Terms and Conditions at any time without prior notice. Changes become effective immediately upon posting to the platform. Your continued use of the platform after updates constitutes acceptance of the revised terms. If you do not agree with the changes, you should discontinue use of the platform.",
  },
  {
    title: "13. Governing Law and Jurisdiction",
    content:
      "These Terms and Conditions are governed by and construed in accordance with the laws of the jurisdiction in which EventX is incorporated. You agree to submit to the exclusive jurisdiction of the courts in that jurisdiction for any disputes arising from your use of the platform.",
  },
  {
    title: "14. Contact Information",
    content:
      "For questions regarding these Terms and Conditions, privacy concerns, or to report violations, please contact our support team at legal@eventx.com or through the support portal on the EventX platform.",
  },
];

export default function EventTermsPage() {
  const reduce = useReducedMotion();

  return (
    <main className="flex flex-1 flex-col">
      <section>
        <div className="mx-auto w-full max-w-6xl px-6 pb-10 pt-20 md:pt-24 lg:pt-24">
          <motion.header
            className="max-w-3xl"
            initial={reduce ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">
              Legal
            </p>
            <h1 className="mt-4 font-display text-5xl font-medium leading-[1.02] tracking-tight text-zinc-900 sm:text-6xl">
              Terms and conditions
            </h1>
            <p className="mt-4 max-w-[56ch] text-lg leading-8 text-zinc-600">
              The agreement governing your use of the EventX platform.
            </p>
            <p className="mt-4 text-sm text-zinc-500">
              Effective June 1, 2026 · Updated June 20, 2026
            </p>
          </motion.header>
        </div>
      </section>

      <section>
        <div className="mx-auto w-full max-w-6xl px-6 pb-24">
          <div className="max-w-3xl">
            <div className="border-t border-zinc-200 pt-8">
              <p className="text-base leading-7 text-zinc-600">
                These Terms and Conditions (&quot;Terms&quot;) govern your
                access to and use of the EventX platform, website, mobile
                applications, and all related services (collectively, the
                &quot;Platform&quot;). By accessing or using EventX, you
                acknowledge that you have read, understood, and agree to be
                bound by these Terms. If you do not agree to any part of these
                Terms, please do not use the Platform.
              </p>
            </div>

            <div className="mt-8">
              {sections.map((section, index) => (
                <div
                  key={index}
                  className="scroll-mt-24 border-t border-zinc-200 py-8"
                >
                  <h2 className="text-lg font-semibold text-zinc-900">
                    {section.title}
                  </h2>
                  <p className="mt-3 text-base leading-7 text-zinc-600">
                    {section.content}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}