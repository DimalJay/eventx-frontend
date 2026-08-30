"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Mail, MapPin, MessageSquare, Phone, Send } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { request } from "@/lib/request";
import ShaderBackground from "@/components/landing/ShaderBackground";

const contactSchema = z.object({
  name: z.string().min(2, { message: "Please enter your name." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  subject: z.string().min(3, { message: "Please add a subject." }),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }),
});

type ContactFormValues = z.infer<typeof contactSchema>;

const channels = [
  {
    icon: Mail,
    title: "Email us",
    lines: ["support@eventx.com", "info@eventx.com"],
  },
  {
    icon: Phone,
    title: "Call us",
    lines: ["+1 (555) 123-4567", "Mon-Fri, 9am-6pm EST"],
  },
  {
    icon: MapPin,
    title: "Visit us",
    lines: ["123 EventX Street", "Tech City, TC 10010"],
  },
];

export default function ContactUsPage() {
  const reduce = useReducedMotion();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = async (data: ContactFormValues) => {
    setIsSubmitting(true);
    try {
      await request("/contact", {
        method: "POST",
        data: {
          name: data.name,
          email: data.email,
          subject: data.subject,
          message: data.message,
        },
      });

      toast.success("Your message has been sent successfully!");
      reset();
    } catch (error) {
      console.error("Form submission error:", error);
      toast.error("Failed to send message. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex flex-1 flex-col">
      <section className="relative overflow-hidden pt-12">
        <ShaderBackground />

        <div className="relative mx-auto w-full max-w-6xl px-6 pb-16 pt-20 md:pt-24 lg:pb-24 lg:pt-20">
          <motion.div
            className="flex flex-col gap-6"
            initial={reduce ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">
              Contact
            </p>
            <h1 className="max-w-[18ch] font-display text-5xl font-medium leading-[1.02] tracking-tight text-zinc-900 sm:text-6xl">
              Talk to the EventX team.
            </h1>
            <p className="max-w-[52ch] text-lg leading-8 text-zinc-600">
              Questions about events, pricing, or the platform? Send us a note
              and the right person will get back to you.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-6 px-6 pb-24 lg:grid-cols-2 lg:gap-8">
          <motion.section
            className="flex h-full flex-col rounded-2xl border border-zinc-200 bg-white p-6 sm:p-8"
            initial={reduce ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-1 flex-col space-y-5"
            >
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <label
                    htmlFor="name"
                    className="text-sm font-medium text-zinc-700"
                  >
                    Your name
                  </label>
                  <input
                    autoComplete="off"
                    id="name"
                    {...register("name")}
                    className={`w-full rounded-xl border bg-white px-4 py-3 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-500 focus:ring-2 ${
                      errors.name
                        ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                        : "border-zinc-200 focus:border-primary/60 focus:ring-primary/20"
                    }`}
                    placeholder="Your name"
                  />
                  {errors.name && (
                    <p className="text-xs font-medium text-red-600">{errors.name.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="text-sm font-medium text-zinc-700"
                  >
                    Email address
                  </label>
                  <input
                    autoComplete="off"
                    type="email"
                    id="email"
                    {...register("email")}
                    className={`w-full rounded-xl border bg-white px-4 py-3 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-500 focus:ring-2 ${
                      errors.email
                        ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                        : "border-zinc-200 focus:border-primary/60 focus:ring-primary/20"
                    }`}
                    placeholder="you@example.com"
                  />
                  {errors.email && (
                    <p className="text-xs font-medium text-red-600">{errors.email.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="subject"
                  className="text-sm font-medium text-zinc-700"
                >
                  Subject
                </label>
                <input
                  autoComplete="off"
                  id="subject"
                  {...register("subject")}
                  className={`w-full rounded-xl border bg-white px-4 py-3 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-500 focus:ring-2 ${
                    errors.subject
                      ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                      : "border-zinc-200 focus:border-primary/60 focus:ring-primary/20"
                  }`}
                  placeholder="How can we help you?"
                />
                {errors.subject && (
                  <p className="text-xs font-medium text-red-600">
                    {errors.subject.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="message"
                  className="text-sm font-medium text-zinc-700"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  {...register("message")}
                  rows={5}
                  className={`w-full resize-none rounded-xl border bg-white px-4 py-3 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-500 focus:ring-2 ${
                    errors.message
                      ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                      : "border-zinc-200 focus:border-primary/60 focus:ring-primary/20"
                  }`}
                  placeholder="Write your message here"
                />
                {errors.message && (
                  <p className="text-xs font-medium text-red-600">
                    {errors.message.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-auto inline-flex h-12 items-center justify-center gap-2 rounded-full bg-primary px-7 text-sm font-semibold text-white transition hover:bg-primary-strong active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
              >
                <Send
                  className={`h-4 w-4 ${isSubmitting ? "animate-pulse" : ""}`}
                  strokeWidth={2}
                />
                {isSubmitting ? "Sending..." : "Send message"}
              </button>
            </form>
          </motion.section>

          <motion.div
            className="flex flex-col gap-5"
            initial={reduce ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          >
            <div className="rounded-2xl border border-zinc-200 bg-white p-7">
              <h2 className="font-display text-xl font-medium tracking-tight text-zinc-900">
                Reach us directly
              </h2>
              {channels.map((channel) => (
                <div
                  key={channel.title}
                  className="flex items-start gap-4 border-t border-zinc-200 py-6"
                >
                  <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary">
                    <channel.icon className="h-5 w-5" strokeWidth={1.75} />
                  </span>
                  <div>
                    <h3 className="text-sm font-semibold text-zinc-900">
                      {channel.title}
                    </h3>
                    {channel.lines.map((line) => (
                      <p key={line} className="mt-0.5 text-sm text-zinc-500">
                        {line}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-2xl border border-zinc-200 bg-zinc-50/70 p-7">
              <div className="flex items-start gap-3">
                <MessageSquare
                  className="mt-0.5 h-5 w-5 shrink-0 text-primary"
                  strokeWidth={1.75}
                />
                <div className="flex flex-col gap-4">
                  <div>
                    <p className="text-sm font-semibold text-zinc-900">
                      Looking for quick answers?
                    </p>
                    <p className="mt-2 text-sm leading-6 text-zinc-600">
                      Check the FAQ page for answers about registration,
                      payments, events, and technical issues.
                    </p>
                  </div>
                  <Link
                    href="/faq"
                    className="inline-flex h-11 w-fit items-center justify-center rounded-full bg-primary px-6 text-sm font-semibold text-white transition hover:bg-primary-strong active:scale-[0.98]"
                  >
                    Visit the FAQ
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}