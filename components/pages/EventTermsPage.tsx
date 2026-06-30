"use client";

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
  return (
    <div className="flex flex-1 items-center justify-center bg-linear-to-br from-[#f7efe2] via-white to-[#e5f4ff]">
      <main className="flex w-full max-w-4xl flex-col gap-10 px-8 py-20 sm:px-14">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div>

          </div>
        </div>

        {/* Document Info */}
        <section className="rounded-3xl border border-black/10 bg-white/80 p-6 shadow-[0_20px_60px_-40px_rgba(0,0,0,0.3)] backdrop-blur sm:p-8">
          <div className="flex flex-col gap-3 mb-8">

            <h1 className="text-3xl font-semibold leading-tight tracking-tight text-black sm:text-4xl">
              Terms and Conditions
            </h1>
            <p className="text-sm leading-6 text-black/70">
              Effective Date: June 1, 2026 | Last Updated: June 20, 2026
            </p>
          </div>

          {/* Introduction */}
          <div className="mb-8 pb-8 border-b border-black/10">
            <p className="text-base leading-7 text-black/80">
              These Terms and Conditions ("Terms") govern your access to and use of the EventX platform, website, mobile applications, and all related services (collectively, the "Platform"). By accessing or using EventX, you acknowledge that you have read, understood, and agree to be bound by these Terms. If you do not agree to any part of these Terms, please do not use the Platform.
            </p>
          </div>

          {/* Full Terms Content */}
          <div className="space-y-8">
            {sections.map((section, index) => (
              <div key={index} className="pb-8 border-b border-black/10 last:border-b-0 last:pb-0">
                <h2 className="mb-4 text-xl font-semibold text-black">
                  {section.title}
                </h2>
                <p className="text-base leading-7 text-black/75">
                  {section.content}
                </p>
              </div>
            ))}
          </div>


        </section>


      </main>
    </div>
  );
}