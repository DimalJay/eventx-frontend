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
      { label: "Event history", href: "/event-history" },
      { label: "Home", href: "/" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Careers", href: "/careers" },
      { label: "Press", href: "/press" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Guides", href: "/guides" },
      { label: "Support", href: "/support" },
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
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
    <footer className="border-t border-black/10 bg-[#f5f1ea]">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-8 py-14 sm:px-12">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <Logo />
              <span className="text-lg font-semibold tracking-wide text-black">
                EventX
              </span>
            </div>
            <p className="max-w-xs text-sm leading-6 text-black/60">
              Plan, launch, and run unforgettable events from one workspace.
              Registration, ticketing, and engagement — together.
            </p>
            <div className="flex flex-wrap gap-3">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-black/15 bg-white/80 text-black transition hover:border-black/40 hover:bg-white"
                >
                  <social.Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {navGroups.map((group) => (
            <div key={group.title} className="flex flex-col gap-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-black/50">
                {group.title}
              </p>
              <ul className="flex flex-col gap-3">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-black/60 transition hover:text-black"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-4 border-t border-black/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs uppercase tracking-[0.2em] text-black/40">
            © {new Date().getFullYear()} EventX. All rights reserved.
          </p>
          <div className="flex flex-wrap gap-6 text-xs font-semibold uppercase tracking-[0.2em] text-black/50">
            <Link href="/privacy" className="transition hover:text-black">
              Privacy
            </Link>

            <Link href="/terms" className="transition hover:text-black">
              Terms
            </Link>

            <Link href="/cookies" className="transition hover:text-black">
              Cookies
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
