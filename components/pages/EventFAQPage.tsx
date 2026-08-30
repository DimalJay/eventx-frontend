"use client";

import { useState, useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ChevronDown, Search, ThumbsUp, ThumbsDown } from "lucide-react";
import ShaderBackground from "@/components/landing/ShaderBackground";

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

const categories = ["All", "Registration", "Payments", "Events", "Technical"];

export default function EventFAQPage() {
  const reduce = useReducedMotion();
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

  return (
    <main className="flex flex-1 flex-col">
      <section className="relative overflow-hidden pt-12">
        <ShaderBackground />

        <div className="relative mx-auto w-full max-w-6xl px-6 pb-10 pt-20 md:pt-24 lg:pt-20">
          <motion.header
            className="max-w-3xl"
            initial={reduce ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">
              Help center
            </p>
            <h1 className="mt-4 font-display text-5xl font-medium leading-[1.02] tracking-tight text-zinc-900 sm:text-6xl">
              Frequently asked questions
            </h1>
            <p className="mt-4 max-w-[56ch] text-lg leading-8 text-zinc-600">
              Answers about registration, payments, events, and technical
              issues. Anything missing? Write to support@eventx.com.
            </p>
          </motion.header>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto w-full max-w-3xl px-6 pb-24">
          <div className="relative">
            <Search
              className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400"
              strokeWidth={2}
            />
            <input
              type="text"
              placeholder="Search questions"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-zinc-200 bg-white py-3 pl-11 pr-4 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-500 focus:border-primary/60 focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-2">
            {categories.map((category) => {
              const active = activeCategory === category;
              return (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`rounded-full px-4 py-2 text-xs font-semibold transition active:scale-[0.98] ${
                    active
                      ? "bg-primary text-white"
                      : "border border-zinc-200 bg-white text-zinc-600 hover:border-primary/50 hover:text-primary"
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>

          <p className="mt-6 text-sm text-zinc-500">
            {filteredFaqs.length} of {faqItems.length} questions
          </p>

          <div className="mt-4 space-y-3">
            {filteredFaqs.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <motion.div
                  key={faq.id}
                  className={`overflow-hidden rounded-2xl border bg-white transition ${
                    isOpen ? "border-zinc-300" : "border-zinc-200"
                  }`}
                  initial={reduce ? false : { opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{
                    duration: 0.5,
                    ease: [0.16, 1, 0.3, 1],
                    delay: index * 0.03,
                  }}
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left"
                  >
                    <div>
                      <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
                        {faq.category}
                      </span>
                      <h3 className="mt-1 text-base font-semibold text-zinc-900">
                        {faq.question}
                      </h3>
                    </div>
                    <ChevronDown
                      className={`h-5 w-5 shrink-0 text-zinc-400 transition-transform duration-300 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                      strokeWidth={2}
                    />
                  </button>

                  <div
                    className={`grid transition-all duration-300 ${
                      isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="border-t border-zinc-100 px-5 pb-5 pt-4">
                        <p className="text-sm leading-7 text-zinc-600">
                          {faq.answer}
                        </p>

                        <div className="mt-4 flex items-center gap-3 border-t border-zinc-100 pt-4">
                          <span className="text-xs text-zinc-500">
                            Was this helpful?
                          </span>
                          <button
                            onClick={() =>
                              setHelpful((prev) => ({
                                ...prev,
                                [faq.id]:
                                  prev[faq.id] === true ? null : true,
                              }))
                            }
                            className={`rounded-lg p-1.5 transition ${
                              helpful[faq.id] === true
                                ? "bg-primary-soft text-primary"
                                : "text-zinc-400 hover:text-zinc-700"
                            }`}
                            aria-label="Mark as helpful"
                          >
                            <ThumbsUp className="h-4 w-4" strokeWidth={2} />
                          </button>
                          <button
                            onClick={() =>
                              setHelpful((prev) => ({
                                ...prev,
                                [faq.id]:
                                  prev[faq.id] === false ? null : false,
                              }))
                            }
                            className={`rounded-lg p-1.5 transition ${
                              helpful[faq.id] === false
                                ? "bg-primary-soft text-primary"
                                : "text-zinc-400 hover:text-zinc-700"
                            }`}
                            aria-label="Mark as not helpful"
                          >
                            <ThumbsDown className="h-4 w-4" strokeWidth={2} />
                          </button>
                        </div>

                        {faq.relatedIds && faq.relatedIds.length > 0 && (
                          <div className="mt-4 border-t border-zinc-100 pt-4">
                            <p className="text-xs font-semibold text-zinc-700">
                              Related questions
                            </p>
                            <div className="mt-2 space-y-1.5">
                              {faq.relatedIds.map((relatedId) => {
                                const relatedFaq = faqItems.find(
                                  (f) => f.id === relatedId
                                );
                                return relatedFaq ? (
                                  <button
                                    key={relatedId}
                                    onClick={() => {
                                      const relatedIndex =
                                        filteredFaqs.findIndex(
                                          (f) => f.id === relatedId
                                        );
                                      if (relatedIndex !== -1) {
                                        setOpenIndex(relatedIndex);
                                      }
                                    }}
                                    className="block text-left text-sm text-primary transition hover:text-primary-strong"
                                  >
                                    {relatedFaq.question}
                                  </button>
                                ) : null;
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {filteredFaqs.length === 0 && (
            <div className="py-16 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary-soft">
                <Search className="h-5 w-5 text-primary" strokeWidth={2} />
              </div>
              <p className="mt-4 font-medium text-zinc-900">
                No questions found
              </p>
              <p className="mt-1 text-sm text-zinc-500">
                Try adjusting your search or category filter.
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}