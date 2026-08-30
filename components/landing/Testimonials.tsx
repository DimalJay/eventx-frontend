"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

const avatars = {
  aisha: "https://randomuser.me/api/portraits/women/68.jpg",
  marcus: "https://randomuser.me/api/portraits/men/32.jpg",
  dilini: "https://randomuser.me/api/portraits/women/44.jpg",
};

const featured = {
  body: "We moved our season onto EventX in one weekend.",
  photo: avatars.aisha,
  name: "Aisha Rahman",
  role: "President, Gavel Club",
};

const supporting = [
  {
    body: "Live polls from the stage changed how I run talks. The room feels connected, and I catch the gaps I used to miss.",
    photo: avatars.marcus,
    name: "Marcus Chen",
    role: "Technical Lead, CS Student Union",
  },
  {
    body: "Check-in was the part I dreaded. Now people scan and walk in, and we know who made it without asking.",
    photo: avatars.dilini,
    name: "Dilini Perera",
    role: "Events Director, Rotaract Club",
  },
];

function Avatar({
  src,
  alt,
  delay,
}: {
  src: string;
  alt: string;
  delay: number;
}) {
  const reduce = useReducedMotion();

  return (
    <motion.img
      src={src}
      alt={alt}
      width={128}
      height={128}
      loading="lazy"
      className="h-10 w-10 rounded-full object-cover ring-2 ring-primary-soft ring-offset-2 ring-offset-white"
      initial={reduce ? false : { scale: 0.5, opacity: 0 }}
      whileInView={{ scale: 1, opacity: 1 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ type: "spring", stiffness: 300, damping: 18, delay }}
    />
  );
}

function RevealWords({ text }: { text: string }) {
  const reduce = useReducedMotion();

  if (reduce) {
    return <>{text}</>;
  }

  return (
    <>
      {text.split(" ").map((word, i) => (
        <motion.span
          key={i}
          className="inline-block"
          initial={{ opacity: 0, y: "0.45em" }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{
            duration: 0.5,
            ease: [0.16, 1, 0.3, 1],
            delay: i * 0.045,
          }}
        >
          {word}
          {i < text.split(" ").length - 1 ? "\u00A0" : ""}
        </motion.span>
      ))}
    </>
  );
}

export default function Testimonials() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const featuredY = useTransform(scrollYProgress, [0, 1], [36, -36]);
  const supportingY = useTransform(scrollYProgress, [0, 1], [64, -44]);

  return (
    <section ref={ref} className="bg-white">
      <div className="mx-auto w-full max-w-6xl px-6 py-20 lg:py-28">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
          <motion.figure
            style={{ y: reduce ? 0 : featuredY }}
            className="lg:col-span-7 lg:border-t lg:border-zinc-200 lg:pt-10"
          >
            <motion.span
              aria-hidden="true"
              className="mr-1 inline-block font-display text-primary/60"
              initial={reduce ? false : { opacity: 0, scale: 0.6, y: 8 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            >
              “
            </motion.span>
            <blockquote className="inline font-display text-2xl font-medium leading-snug tracking-tight text-zinc-900 md:text-3xl lg:text-4xl">
              <RevealWords text={featured.body} />
            </blockquote>
            <motion.figcaption
              className="mt-6 flex items-center gap-3"
              initial={reduce ? false : { opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
            >
              <Avatar src={featured.photo} alt={featured.name} delay={0.35} />
              <span>
                <span className="block text-sm font-semibold text-zinc-900">
                  {featured.name}
                </span>
                <span className="mt-0.5 block text-xs text-zinc-500">{featured.role}</span>
              </span>
            </motion.figcaption>
          </motion.figure>

          <motion.div
            style={{ y: reduce ? 0 : supportingY }}
            className="lg:col-span-5 lg:border-t lg:border-zinc-200 lg:pt-10"
          >
            {supporting.map((quote, idx) => (
              <motion.figure
                key={quote.name}
                className={idx > 0 ? "mt-7 border-t border-zinc-200 pt-7" : ""}
                initial={reduce ? false : { opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{
                  duration: 0.6,
                  ease: [0.16, 1, 0.3, 1],
                  delay: idx === 0 ? 0.15 : 0.3,
                }}
              >
                <blockquote className="font-display text-lg font-medium leading-snug text-zinc-800">
                  “{quote.body}”
                </blockquote>
                <figcaption className="mt-5 flex items-center gap-3">
                  <Avatar src={quote.photo} alt={quote.name} delay={0.2 + idx * 0.18} />
                  <span>
                    <span className="block text-sm font-semibold text-zinc-900">
                      {quote.name}
                    </span>
                    <span className="block text-xs text-zinc-500">{quote.role}</span>
                  </span>
                </figcaption>
              </motion.figure>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}