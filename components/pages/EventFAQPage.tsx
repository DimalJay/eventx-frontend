"use client";

import { useState, useMemo } from "react";
import { ChevronDown, Search, MessageCircle, ThumbsUp, ThumbsDown } from "lucide-react";

const faqItems = [
  {
    id: 1,
    category: "Registration",
    question: "How do I register for an event?",
    answer:
      "Navigate to the Events page, select your preferred event, and click the 'Register Now' button. Fill in your details, review the event information, and confirm your registration. You'll receive a confirmation email immediately.",
    relatedIds: [2, 3],
  },
  {
    id: 2,
    category: "Registration",
    question: "Can I cancel my registration?",
    answer:
      "Yes, you can cancel your registration before the event's cancellation deadline. Go to 'My Events' in your dashboard, select the event, and click 'Cancel Registration'. Refund eligibility depends on the organizer's policy.",
    relatedIds: [1, 4],
  },
  {
    id: 3,
    category: "Registration",
    question: "Can I update my registration details?",
    answer:
      "You can edit your registration information such as name, email, and dietary preferences from your dashboard before the event. Click 'Edit Registration' next to the event you're attending. Some fields may be locked if the event has already started.",
    relatedIds: [1, 2, 6],
  },
  {
    id: 4,
    category: "Registration",
    question: "What happens if I don't register before the deadline?",
    answer:
      "If registration closes, you may still be able to register on-site depending on availability. Contact the event organizer directly or check the event details for walk-in registration information.",
    relatedIds: [1, 2],
  },
  {
    id: 5,
    category: "Payments",
    question: "What payment methods are supported?",
    answer:
      "We support major credit cards (Visa, Mastercard, American Express), debit cards, and digital wallets including Apple Pay and Google Pay. All payments are processed securely with encryption.",
    relatedIds: [8, 9],
  },
  {
    id: 6,
    category: "Payments",
    question: "Can I request a refund?",
    answer:
      "Refund eligibility is determined by the event organizer's policy. Some events offer full refunds if you cancel before a certain date, while others may not offer refunds at all. Check the event's refund policy before registering. Contact our support team to initiate a refund request.",
    relatedIds: [2, 4, 8],
  },
  {
    id: 7,
    category: "Payments",
    question: "Is my payment information secure?",
    answer:
      "Yes, all payment information is encrypted using industry-standard SSL/TLS technology. EventX never stores your full credit card details. Payments are processed through PCI-DSS compliant payment processors.",
    relatedIds: [5, 9],
  },
  {
    id: 8,
    category: "Payments",
    question: "Why was my payment declined?",
    answer:
      "Payment declines can happen for several reasons: insufficient funds, incorrect card details, expired card, or fraud detection. Verify your information and try again. If the issue persists, contact your bank or use a different payment method.",
    relatedIds: [5, 6, 7],
  },
  {
    id: 9,
    category: "Payments",
    question: "Do you offer payment plans or discounts?",
    answer:
      "Payment options depend on the event organizer. Some events offer group discounts, early-bird pricing, or installment plans. Check the event details page for available pricing options and special offers.",
    relatedIds: [5, 8],
  },
  {
    id: 10,
    category: "Events",
    question: "Where can I view event schedules?",
    answer:
      "Event schedules are available on the event details page after registration. You can also view your registered events in the 'My Events' section of your dashboard. Schedules are typically shared 1-2 weeks before the event.",
    relatedIds: [1, 11, 12],
  },
  {
    id: 11,
    category: "Events",
    question: "Will I receive event updates?",
    answer:
      "Important event updates are delivered via email and in-app notifications. You can manage your notification preferences in your account settings. We recommend keeping notifications enabled to stay informed about schedule changes and important announcements.",
    relatedIds: [10, 12],
  },
  {
    id: 12,
    category: "Events",
    question: "How do I add an event to my calendar?",
    answer:
      "Click the 'Add to Calendar' button on the event details page. This will let you add the event to Google Calendar, Outlook, Apple Calendar, or download it as an ICS file.",
    relatedIds: [10, 11],
  },
  {
    id: 13,
    category: "Events",
    question: "Can I download my ticket or event confirmation?",
    answer:
      "Yes, you can download your event confirmation and ticket from your dashboard under 'My Events'. Tickets are provided as PDF files that you can print or display on your mobile device.",
    relatedIds: [1, 12],
  },
  {
    id: 14,
    category: "Technical",
    question: "I forgot my password. How do I reset it?",
    answer:
      "Click 'Forgot Password' on the login page. Enter your email address, and we'll send you a password reset link. Follow the instructions in the email to create a new password.",
    relatedIds: [15, 16],
  },
  {
    id: 15,
    category: "Technical",
    question: "How do I change my email address?",
    answer:
      "Go to your account settings and select 'Email & Password'. Click 'Change Email' and enter your new email address. You'll receive a verification email to confirm the change.",
    relatedIds: [14, 16],
  },
  {
    id: 16,
    category: "Technical",
    question: "Why can't I log into my account?",
    answer:
      "First, verify you're using the correct email address and password. Check that your account isn't locked due to multiple failed login attempts. If you still can't access your account, try resetting your password or contact our support team.",
    relatedIds: [14, 15],
  },
  {
    id: 17,
    category: "Technical",
    question: "Is EventX mobile-friendly?",
    answer:
      "Yes, EventX is fully optimized for mobile devices and tablets. Download our mobile app from the App Store or Google Play for the best experience, or use our responsive website.",
    relatedIds: [18],
  },
  {
    id: 18,
    category: "Technical",
    question: "How do I contact support?",
    answer:
      "You can reach our support team through the 'Help & Support' section in your account, email us at support@eventx.com, or use the chat widget available on our website. We typically respond within 24 hours.",
    relatedIds: [14, 16, 17],
  },
];

const categories = [
  "All",
  "Registration",
  "Payments",
  "Events",
  "Technical",
];

const highlights = [
  {
    title: "Instant Answers",
    body: "Find answers to common questions in seconds.",
  },
  {
    title: "24/7 Support",
    body: "Our support team is available around the clock.",
  },
  {
    title: "Detailed Guides",
    body: "Step-by-step instructions for every feature.",
  },
];

export default function EventFAQPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [helpful, setHelpful] = useState<{ [key: number]: boolean | null }>({});

  const filteredFaqs = useMemo(() => {
    return faqItems.filter((faq) => {
      const categoryMatch =
        activeCategory === "All" || faq.category === activeCategory;
      const searchMatch =
        faq.question.toLowerCase().includes(search.toLowerCase()) ||
        faq.answer.toLowerCase().includes(search.toLowerCase());
      return categoryMatch && searchMatch;
    });
  }, [search, activeCategory]);

  const currentFaq = openIndex !== null ? filteredFaqs[openIndex] : null;

  return (
    <div className="flex flex-1 items-center justify-center bg-linear-to-br from-[#f7efe2] via-white to-[#e5f4ff]">
      <main className="flex w-full max-w-5xl flex-col gap-10 px-8 py-20 sm:px-14">
        <div className="flex items-center gap-3">
          <div>
          </div>
        </div>

        <div className=" gap-10 lg:items-start">
          {/* Section: FAQ Content */}
          <section className="rounded-3xl border border-black/10 bg-white/80 p-6 shadow-[0_20px_60px_-40px_rgba(0,0,0,0.3)] backdrop-blur sm:p-8">
            <div className="flex flex-col gap-3 mb-8">
              <h1 className="text-3xl font-semibold leading-tight tracking-tight text-black sm:text-4xl">
                Frequently Asked Questions
              </h1>
              <p className="text-sm leading-6 text-black/70">
                Find answers to common questions about registration, payments, events, and technical issues.
              </p>
            </div>

            {/* Search Bar */}
            <div className="mb-6 relative">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-black/40"
              />
              <input
                type="text"
                placeholder="Search questions..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-2xl border border-black/10 bg-white text-sm text-black outline-none transition focus:border-black/30"
              />
            </div>

            {/* Category Filter */}
            <div className="mb-6 flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-widest transition ${activeCategory === category
                      ? "bg-black text-white"
                      : "border border-black/10 text-black hover:border-black/30 bg-white"
                    }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* FAQ Count */}
            <p className="text-xs text-black/60 mb-4">
              {filteredFaqs.length} of {faqItems.length} questions
            </p>

            {/* FAQ Items */}
            <div className="space-y-3">
              {filteredFaqs.map((faq, index) => (
                <div
                  key={faq.id}
                  className="overflow-hidden rounded-2xl border border-black/10 bg-white transition hover:border-black/20"
                >
                  <button
                    onClick={() =>
                      setOpenIndex(openIndex === index ? null : index)
                    }
                    className="flex w-full items-center justify-between px-4 py-4 text-left sm:px-5"
                  >
                    <div className="flex-1">
                      <span className="mb-2 inline-flex rounded-full bg-black/5 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-black/60">
                        {faq.category}
                      </span>
                      <h3 className="text-base font-semibold text-black">
                        {faq.question}
                      </h3>
                    </div>
                    <ChevronDown
                      size={20}
                      className={`ml-4 flex-shrink-0 transition-transform duration-300 ${openIndex === index ? "rotate-180" : ""
                        }`}
                    />
                  </button>

                  <div
                    className={`grid transition-all duration-300 ${openIndex === index
                        ? "grid-rows-[1fr]"
                        : "grid-rows-[0fr]"
                      }`}
                  >
                    <div className="overflow-hidden">
                      <div className="border-t border-black/5 px-4 py-4 sm:px-5">
                        <p className="text-sm leading-6 text-black/70 mb-4">
                          {faq.answer}
                        </p>

                        {/* Helpful Feedback */}
                        <div className="flex items-center gap-3 pt-4 border-t border-black/5">
                          <span className="text-xs text-black/60">Was this helpful?</span>
                          <button
                            onClick={() =>
                              setHelpful((prev) => ({
                                ...prev,
                                [faq.id]: prev[faq.id] === true ? null : true,
                              }))
                            }
                            className={`p-1.5 rounded-lg transition ${helpful[faq.id] === true
                                ? "bg-black/10 text-black"
                                : "text-black/40 hover:text-black"
                              }`}
                          >
                            <ThumbsUp size={16} />
                          </button>
                          <button
                            onClick={() =>
                              setHelpful((prev) => ({
                                ...prev,
                                [faq.id]: prev[faq.id] === false ? null : false,
                              }))
                            }
                            className={`p-1.5 rounded-lg transition ${helpful[faq.id] === false
                                ? "bg-black/10 text-black"
                                : "text-black/40 hover:text-black"
                              }`}
                          >
                            <ThumbsDown size={16} />
                          </button>
                        </div>

                        {/* Related Questions */}
                        {faq.relatedIds && faq.relatedIds.length > 0 && (
                          <div className="mt-4 pt-4 border-t border-black/5">
                            <p className="text-xs font-semibold text-black/60 mb-2">
                              Related Questions:
                            </p>
                            <div className="space-y-1">
                              {faq.relatedIds.map((relatedId) => {
                                const relatedFaq = faqItems.find(
                                  (f) => f.id === relatedId
                                );
                                return relatedFaq ? (
                                  <button
                                    key={relatedId}
                                    onClick={() => {
                                      const relatedIndex = filteredFaqs.findIndex(
                                        (f) => f.id === relatedId
                                      );
                                      if (relatedIndex !== -1) {
                                        setOpenIndex(relatedIndex);
                                      }
                                    }}
                                    className="block text-xs text-black/60 hover:text-black transition text-left"
                                  >
                                    • {relatedFaq.question}
                                  </button>
                                ) : null;
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredFaqs.length === 0 && (
              <div className="text-center py-12">
                <p className="text-black/60 mb-2">No questions found.</p>
                <p className="text-xs text-black/50">
                  Try adjusting your search or category filter.
                </p>
              </div>
            )}
          </section>

          {/* Right Section: Quick Access & Resources */}

        </div>
      </main>
    </div>
  );
}