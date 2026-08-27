'use client'
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SiX, SiInstagram } from "react-icons/si";
import { FaLinkedinIn } from "react-icons/fa";
import Logo from "./Logo";

const DARK_ROUTES = ["/"];

const navGroups = [
  {
    title: "Product",
    links: [
      { label: "Create event", href: "/event/create" },
      { label: "Dashboard", href: "/home" },
      { label: "Home", href: "/" }
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Contact", href: "/contact-us" },
      { label: "About", href: "/about-us" }

    ],
  },
  {
    title: "Resources",
    links: [
      { label: "FAQ", href: "/faq" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms & Conditions", href: "/terms" }
    ],
  },
];

const socials = [
  { label: "X", href: "#", Icon: SiX },
  { label: "LinkedIn", href: "#", Icon: FaLinkedinIn },
  { label: "Instagram", href: "#", Icon: SiInstagram }
];

export default function Footer() {
  const pathname = usePathname();
  const onDark = DARK_ROUTES.includes(pathname);

  return (
    <footer className={onDark ? "border-t border-white/10 bg-[#0d0c0a]" : "border-t border-black/10 bg-[#f5f1ea]"}>
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-8 py-14 sm:px-12">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <Logo />
              <span className={`text-lg font-semibold tracking-wide ${onDark ? "text-white" : "text-black"}`}>
                EventX
              </span>
            </div>
            <p className={`max-w-xs text-sm leading-6 ${onDark ? "text-white/60" : "text-black/60"}`}>
              Plan, launch, and run unforgettable events from one workspace.
              Registration, ticketing, and engagement, together.
            </p>
            <div className="flex flex-wrap gap-3">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className={
                    onDark
                      ? "inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white transition hover:border-white/40 hover:bg-white/10"
                      : "inline-flex h-10 w-10 items-center justify-center rounded-full border border-black/15 bg-white/80 text-black transition hover:border-black/40 hover:bg-white"
                  }
                >
                  <social.Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {navGroups.map((group) => (
            <div key={group.title} className="flex flex-col gap-4">
              <p className={`text-xs font-semibold uppercase tracking-[0.2em] ${onDark ? "text-white/45" : "text-black/50"}`}>
                {group.title}
              </p>
              <ul className="flex flex-col gap-3">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className={`text-sm transition ${onDark ? "text-white/60 hover:text-white" : "text-black/60 hover:text-black"}`}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className={`flex flex-col gap-4 border-t pt-8 sm:flex-row sm:items-center sm:justify-between ${onDark ? "border-white/10" : "border-black/10"}`}>
          <p className={`text-xs uppercase tracking-[0.2em] ${onDark ? "text-white/40" : "text-black/40"}`}>
            © {new Date().getFullYear()} EventX. All rights reserved.
          </p>
          <div className={`flex flex-wrap gap-6 text-xs font-semibold uppercase tracking-[0.2em] ${onDark ? "text-white/55" : "text-black/50"}`}>
            <Link href="/privacy" className={`transition ${onDark ? "hover:text-white" : "hover:text-black"}`}>
              Privacy
            </Link>

            <Link href="/terms" className={`transition ${onDark ? "hover:text-white" : "hover:text-black"}`}>
              Terms
            </Link>

          </div>
        </div>

      </div>
    </footer>
  );
}
