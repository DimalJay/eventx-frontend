import Link from "next/link";
import { SiX, SiInstagram } from "react-icons/si";
import { FaLinkedinIn } from "react-icons/fa";
import Logo from "./Logo";

const navGroups = [
  {
    title: "Product",
    links: [
      { label: "Create event", href: "/event/create" },
      { label: "Dashboard", href: "/home" },
      { label: "Home", href: "/" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Contact", href: "/contact-us" },
      { label: "About", href: "/about-us" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "FAQ", href: "/faq" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms & Conditions", href: "/terms" },
    ],
  },
];

const socials = [
  { label: "X", href: "#", Icon: SiX },
  { label: "LinkedIn", href: "#", Icon: FaLinkedinIn },
  { label: "Instagram", href: "#", Icon: SiInstagram },
];

export default function Footer() {
  return (
    <footer className="border-t border-zinc-200/80 bg-zinc-50/70">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-6 py-14">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <Logo className="h-8 w-8" />
              <span className="font-display text-lg font-medium text-zinc-900">
                EventX
              </span>
            </div>
            <p className="max-w-xs text-sm leading-6 text-zinc-500">
              Plan, launch, and run unforgettable events from one workspace.
              Registration, ticketing, and live engagement together.
            </p>
            <div className="flex flex-wrap gap-3">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-600 transition hover:border-primary/40 hover:text-primary"
                >
                  <social.Icon className="h-3.5 w-3.5" />
                </a>
              ))}
            </div>
          </div>

          {navGroups.map((group) => (
            <div key={group.title} className="flex flex-col gap-4">
              <p className="text-sm font-semibold text-zinc-900">
                {group.title}
              </p>
              <ul className="flex flex-col gap-3">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-zinc-500 transition hover:text-primary"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-4 border-t border-zinc-200/80 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-zinc-500">
            © {new Date().getFullYear()} EventX. All rights reserved.
          </p>
          <div className="flex flex-wrap gap-6 text-sm font-medium text-zinc-500">
            <Link href="/privacy" className="transition hover:text-primary">
              Privacy
            </Link>
            <Link href="/terms" className="transition hover:text-primary">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}