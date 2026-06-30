"use client";

const sections = [
  {
    title: "1. Introduction and Commitment to Privacy",
    content:
      "EventX ('we', 'our', or 'us') is committed to protecting your privacy and ensuring you have a positive experience on our platform. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website, mobile application, and use our services (collectively, the 'Platform'). Please read this Privacy Policy carefully. If you do not agree with our policies and practices, please do not use our Platform.",
  },
  {
    title: "2. Information We Collect",
    content:
      "We collect information you provide directly, including name, email address, phone number, postal address, payment information, and profile information during registration and event participation. We automatically collect certain information such as IP address, browser type, operating system, referral URLs, and pages visited. We may receive information about you from third-party event organizers, payment processors, and social media platforms if you link accounts. Cookies and similar tracking technologies help us understand how you use our Platform and remember your preferences.",
  },
  {
    title: "3. How We Use Your Information",
    content:
      "We use your information to create and maintain your account, process transactions and send related information, provide customer service and support, send promotional communications (with your consent), conduct research and analytics to improve our services, personalize your experience and deliver content tailored to your interests, detect and prevent fraudulent activity and unauthorized access, comply with legal obligations and enforce our Terms and Conditions, and monitor usage patterns to enhance security and functionality.",
  },
  {
    title: "4. Information Sharing and Disclosure",
    content:
      "We share information with event organizers necessary to process your registration and attendance. Payment information is shared with PCI-compliant payment processors to facilitate transactions. We may disclose information when required by law, court order, or government request. We may share aggregated, non-identifiable information with business partners and third-party service providers. In the event of a merger, acquisition, or bankruptcy, your information may be transferred as part of business assets. We do not sell or rent your personal information to third parties for marketing purposes.",
  },
  {
    title: "5. Data Security and Protection",
    content:
      "EventX implements industry-standard security measures including SSL/TLS encryption, secure password hashing, firewalls, and regular security audits. However, no method of transmission over the internet is completely secure. While we strive to protect your personal information, we cannot guarantee absolute security. You are responsible for maintaining the confidentiality of your login credentials. If you believe your account has been compromised, contact our support team immediately.",
  },
  {
    title: "6. Your Privacy Rights and Choices",
    content:
      "You have the right to access your personal information and request corrections or updates. You may opt out of marketing communications at any time. Depending on your location, you may have the right to request deletion of your data, restriction of processing, or data portability. If you are a California resident (CCPA), you have specific rights including access, deletion, and opting out of data sales. If you are in the European Union (GDPR), you have rights including access, rectification, erasure, restriction, and portability. To exercise these rights, contact our privacy team.",
  },
  {
    title: "7. Cookies and Tracking Technologies",
    content:
      "EventX uses cookies to enhance your experience, remember preferences, and analyze Platform usage. You can control cookie settings through your browser, though disabling cookies may affect functionality. We use analytics tools like Google Analytics to understand user behavior and improve our services. Third-party vendors may also place cookies for advertising and performance tracking. We do not respond to 'Do Not Track' signals, but you can opt out of targeted advertising through industry opt-out tools.",
  },
  {
    title: "8. Third-Party Links and Services",
    content:
      "Our Platform may contain links to third-party websites and services that are not operated by EventX. This Privacy Policy does not apply to third-party sites, and we are not responsible for their privacy practices. We encourage you to review the privacy policies of any third-party services before providing your information. When you use third-party payment processors or social login services, their privacy policies govern the collection and use of that information.",
  },
  {
    title: "9. Data Retention and Deletion",
    content:
      "We retain your personal information for as long as necessary to provide services and fulfill the purposes outlined in this policy. Account information may be retained for legal, accounting, and legitimate business purposes. If you request deletion, we will remove your data within 30 days, except where we are required to retain it by law. Event registration data is typically retained for 2 years after the event date for historical and administrative purposes.",
  },
  {
    title: "10. Children's Privacy",
    content:
      "EventX does not knowingly collect personal information from children under 13 years of age. If we discover that a child under 13 has provided information, we will delete it immediately. If you believe a child has provided information, contact us at privacy@eventx.com. For users between 13-18, parental consent may be required depending on applicable laws.",
  },
  {
    title: "11. International Data Transfers",
    content:
      "EventX operates globally, and your information may be transferred to, stored in, and processed in countries other than your country of residence. These countries may have data protection laws that differ from your home country. By using our Platform, you consent to the transfer of your information to countries outside your country of residence, including the United States, which may not have the same data protection laws.",
  },
  {
    title: "12. California and US State Privacy Rights (CCPA/CPRA)",
    content:
      "If you are a California resident, you have specific rights under the California Consumer Privacy Act (CCPA) and California Privacy Rights Act (CPRA). You have the right to know what personal information is collected, used, and shared. You may request deletion of collected personal information. You have the right to opt-out of the sale or sharing of personal information. You have the right to non-discrimination for exercising your privacy rights. To submit a request, email privacy@eventx.com with 'CCPA Request' in the subject line.",
  },
  {
    title: "13. European Union and GDPR Compliance",
    content:
      "For residents of the European Union and European Economic Area, we comply with the General Data Protection Regulation (GDPR). We only process your data based on lawful grounds including consent, contract performance, legal obligation, or legitimate interests. You have the right to access, rectify, erase, restrict processing, and data portability. You have the right to withdraw consent at any time. You have the right to lodge a complaint with your local data protection authority.",
  },
  {
    title: "14. Policy Updates and Changes",
    content:
      "EventX may update this Privacy Policy periodically to reflect changes in our practices, technology, legal requirements, or other factors. We will notify you of significant changes by posting the updated policy on our Platform and updating the 'Last Updated' date. Your continued use of the Platform following the posting of changes constitutes your acceptance of the updated Privacy Policy. We encourage you to review this policy regularly to stay informed about how we protect your information.",
  },
  {
    title: "15. Contact Us and Data Protection Officer",
    content:
      "If you have questions about this Privacy Policy, your personal information, or our privacy practices, please contact us at privacy@eventx.com. For GDPR or data protection inquiries, you can reach our Data Protection Officer at dpo@eventx.com. You may also contact us by mail at: EventX Legal Team, Privacy Department, [Address]. We will respond to your inquiry within 30 days.",
  },
];

export default function EventPrivacyPage() {
  return (
    <div className="flex flex-1 items-center justify-center bg-linear-to-br from-[#f7efe2] via-white to-[#e5f4ff]">
      <main className="flex w-full max-w-5xl flex-col gap-10 px-8 py-20 sm:px-14">
        <div className="flex items-center gap-3">
          <div>
          </div>
        </div>

        {/* Main Document */}
        <section className="rounded-3xl border border-black/10 bg-white/80 p-6 shadow-[0_20px_60px_-40px_rgba(0,0,0,0.3)] backdrop-blur sm:p-8">
          {/* Document Header */}
          <div className="mb-8 flex flex-col gap-3">

            <h1 className="text-3xl font-semibold leading-tight tracking-tight text-black sm:text-4xl">
              Privacy Policy
            </h1>
            <p className="text-sm leading-6 text-black/70">
              Effective Date: June 1, 2026 | Last Updated: June 20, 2026
            </p>
          </div>

          {/* Introduction */}
          <div className="mb-8 pb-8 border-b border-black/10">
            <p className="text-base leading-7 text-black/80">
              This Privacy Policy describes how EventX collects, uses, and protects your personal information. We are committed to maintaining the trust you place in us and being transparent about our data practices. This policy applies to all EventX services, websites, and applications.
            </p>
          </div>

          {/* Table of Contents */}
          <div className="mb-8 pb-8 border-b border-black/10">
            <h2 className="mb-4 text-lg font-semibold text-black">Quick Links</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {sections.map((section, index) => (
                <a
                  key={index}
                  href={`#section-${index}`}
                  className="text-sm text-black/60 hover:text-black transition truncate"
                >
                  {section.title}
                </a>
              ))}
            </div>
          </div>

          {/* Full Privacy Policy Content */}
          <div className="space-y-8">
            {sections.map((section, index) => (
              <div key={index} id={`section-${index}`} className="pb-8 border-b border-black/10 last:border-b-0 last:pb-0">
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
