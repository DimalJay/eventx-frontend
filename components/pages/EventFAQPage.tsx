"use client";

import { useMemo, useState } from "react";
import Logo from "../widgets/Logo";

import {
  Search,
  HelpCircle,
  Users,
  BadgeCheck,
  HeadphonesIcon,
  ChevronDown,
  UserPlus,
  CreditCard,
  CalendarDays,
  Settings,
} from "lucide-react";

const faqItems = [
  {
    category: "Registration",
    question: "How do I register for an event?",
    answer:
      "Navigate to the Events page, select your preferred event, and complete the registration process.",
  },
  {
    category: "Registration",
    question: "Can I cancel my registration?",
    answer:
      "Yes. Registrations can be cancelled before the registration deadline.",
  },
  {
    category: "Registration",
    question: "Can I update my registration details?",
    answer:
      "You can edit your registration information from your participant dashboard before the registration deadline.",
  },
  {
    category: "Payments",
    question: "What payment methods are supported?",
    answer:
      "We support debit cards, credit cards, and selected online payment gateways.",
  },
  {
    category: "Payments",
    question: "Can I request a refund?",
    answer:
      "Refund requests depend on the event organizer's refund policy.",
  },
  {
    category: "Events",
    question: "Where can I view event schedules?",
    answer:
      "Schedules become available after registration and can be accessed from the event details page.",
  },
  {
    category: "Events",
    question: "Will I receive event updates?",
    answer:
      "Important updates are delivered via email and in-app notifications.",
  },
  {
    category: "Technical",
    question: "I forgot my password.",
    answer:
      "Use the Forgot Password option available on the login page.",
  },
  {
    category: "Technical",
    question: "Why can't I access my dashboard?",
    answer:
      "Please ensure you are logged into the correct account and verify your internet connection.",
  },
];

const categoryConfig = [
  {
    name: "All",
    icon: HelpCircle,
  },
  {
    name: "Registration",
    icon: UserPlus,
  },
  {
    name: "Payments",
    icon: CreditCard,
  },
  {
    name: "Events",
    icon: CalendarDays,
  },
  {
    name: "Technical",
    icon: Settings,
  },
];

export default function EventFAQPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const filteredFaqs = useMemo(() => {
    return faqItems.filter((faq) => {
      const categoryMatch =
        activeCategory === "All" ||
        faq.category === activeCategory;

      const searchMatch =
        faq.question.toLowerCase().includes(search.toLowerCase()) ||
        faq.answer.toLowerCase().includes(search.toLowerCase());

      return categoryMatch && searchMatch;
    });
  }, [search, activeCategory]);

  return (
    <div className="relative flex flex-1 justify-center overflow-hidden bg-[#f5f1ea]">
      {/* Background Effects */}
      <div className="pointer-events-none absolute -left-24 top-10 h-52 w-52 rounded-full bg-[#ffc9a7] opacity-35 blur-3xl" />
      <div className="pointer-events-none absolute right-8 top-16 h-64 w-64 rounded-full bg-[#9fd3ff] opacity-35 blur-3xl" />
      <div className="pointer-events-none absolute bottom-10 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-[#ffe8a3] opacity-40 blur-3xl" />

      <main className="relative flex w-full max-w-7xl flex-col gap-10 px-8 py-16 sm:px-12">
        {/* Hero */}
        <header className="flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <Logo />

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-black/50">
                EventX Support Center
              </p>

              <h1 className="text-5xl font-semibold tracking-tight text-black">
                How can we help?
              </h1>
            </div>
          </div>

          <p className="max-w-2xl text-base leading-7 text-black/70">
            Find answers, guides, and support resources for EventX.
          </p>
        </header>

        {/* Search */}
        <section className="rounded-[32px] border border-black/10 bg-white/70 p-6 backdrop-blur-sm">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-black/40"
            />

            <input
              type="text"
              placeholder="Search questions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-14 w-full rounded-2xl border border-black/10 bg-white pl-12 pr-4 outline-none transition focus:border-black/30"
            />
          </div>
        </section>

        {/* Stats */}
        <section className="grid gap-4 md:grid-cols-3">
          <div className="rounded-[28px] border border-black/10 bg-white/80 p-6 backdrop-blur-sm">
            <HelpCircle className="mb-4" size={24} />

            <h3 className="text-3xl font-bold">250+</h3>

            <p className="mt-2 text-black/60">
              Frequently Asked Questions
            </p>
          </div>

          <div className="rounded-[28px] border border-black/10 bg-white/80 p-6 backdrop-blur-sm">
            <Users className="mb-4" size={24} />

            <h3 className="text-3xl font-bold">10K+</h3>

            <p className="mt-2 text-black/60">
              Active Participants
            </p>
          </div>

          <div className="rounded-[28px] border border-black/10 bg-white/80 p-6 backdrop-blur-sm">
            <BadgeCheck className="mb-4" size={24} />

            <h3 className="text-3xl font-bold">98%</h3>

            <p className="mt-2 text-black/60">
              Support Satisfaction
            </p>
          </div>
        </section>

        {/* Popular Questions */}
        <section>
          <h2 className="mb-4 text-xl font-semibold">
            Popular Questions
          </h2>

          <div className="flex flex-wrap gap-3">
            {faqItems.slice(0, 4).map((faq) => (
              <button
                key={faq.question}
                className="rounded-full border border-black/10 bg-white px-5 py-3 text-sm transition hover:border-black/30"
              >
                {faq.question}
              </button>
            ))}
          </div>
        </section>

        {/* FAQ Content */}
        <section className="grid gap-8 lg:grid-cols-[280px_1fr]">
          {/* Sidebar */}
          <aside className="h-fit lg:sticky lg:top-8">
            <div className="rounded-[28px] border border-black/10 bg-white/80 p-5 backdrop-blur-sm">
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-widest text-black/60">
                Categories
              </h3>

              <div className="space-y-2">
                {categoryConfig.map((category) => {
                  const Icon = category.icon;

                  return (
                    <button
                      key={category.name}
                      onClick={() =>
                        setActiveCategory(category.name)
                      }
                      className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-medium transition ${
                        activeCategory === category.name
                          ? "bg-black text-white"
                          : "hover:bg-black/5"
                      }`}
                    >
                      <Icon size={18} />

                      <span className="flex-1">
                        {category.name}
                      </span>

                      {activeCategory === category.name && (
                        <div className="h-2 w-2 rounded-full bg-white" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </aside>

          {/* FAQ List */}
          <div>
            <div className="mb-6">
              <h2 className="text-3xl font-semibold">
                {activeCategory === "All"
                  ? "All Questions"
                  : activeCategory}
              </h2>

              <p className="mt-2 text-black/60">
                {filteredFaqs.length} questions found
              </p>
            </div>

            <div className="space-y-4">
              {filteredFaqs.map((faq, index) => (
                <div
                  key={faq.question}
                  className="overflow-hidden rounded-[28px] border border-black/10 bg-white/80 backdrop-blur-sm"
                >
                  <button
                    onClick={() =>
                      setOpenIndex(
                        openIndex === index ? null : index
                      )
                    }
                    className="flex w-full items-center justify-between px-6 py-5 text-left"
                  >
                    <div>
                      <span className="mb-2 inline-flex rounded-full bg-black/5 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-black/60">
                        {faq.category}
                      </span>

                      <h3 className="text-base font-semibold">
                        {faq.question}
                      </h3>
                    </div>

                    <ChevronDown
                      className={`transition-transform duration-300 ${
                        openIndex === index
                          ? "rotate-180"
                          : ""
                      }`}
                    />
                  </button>

                  <div
                    className={`grid transition-all duration-300 ${
                      openIndex === index
                        ? "grid-rows-[1fr]"
                        : "grid-rows-[0fr]"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="border-t border-black/5 px-6 py-5 leading-7 text-black/70">
                        {faq.answer}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Support CTA */}
        <section className="rounded-[36px] bg-black p-8 text-white">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-white/60">
                Still Need Help?
              </p>

              <h2 className="mt-3 text-4xl font-semibold">
                Contact Support
              </h2>

              <p className="mt-4 max-w-xl text-white/70">
                Can't find what you're looking for? Our team is
                ready to assist you with registration issues,
                payments, event management, and technical support.
              </p>
            </div>

            <button className="inline-flex h-14 items-center gap-3 rounded-full bg-white px-7 font-semibold text-black transition hover:scale-[1.02]">
              <HeadphonesIcon size={18} />
              Open Support Ticket
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}