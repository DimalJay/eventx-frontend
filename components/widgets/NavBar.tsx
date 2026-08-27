'use client'
import { cn } from "@/lib/utils";
import Logo from "./Logo";
import Link from "next/link";
import { usePathname } from "next/navigation";
import UserMenu from "./UserMenu";
import NotificationsMenu from "./NotificationsMenu";
import { useAuth } from "../auth/AuthContext";

const DARK_ROUTES = ["/"];

export default function NavBar({ className }: { className: string }) {
    const { isAuthenticated } = useAuth();
    const pathname = usePathname();
    const isLanding = DARK_ROUTES.includes(pathname);

    return (
        <header className={cn(className, "px-4 py-4 flex justify-between items-center")}>
            {isLanding ? (
                <Link href="/" className="inline-flex items-center gap-2.5 rounded-full py-1 pl-1 pr-3">
                    <Logo className="h-8 w-8" variant="inverted" />
                    <span className="font-semibold text-white">EventX</span>
                </Link>
            ) : (
                <Link
                    href="/"
                    className="inline-flex items-center gap-2.5 rounded-full bg-white/90 py-1.5 pl-2 pr-4 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.35)] backdrop-blur transition hover:bg-white"
                >
                    <Logo className="h-8 w-8" />
                    <span className="font-semibold text-black">EventX</span>
                </Link>
            )}
            {isAuthenticated ?
                (isLanding ? (
                    <div className="flex flex-row items-center gap-5 text-white">
                        <Link href={"/event/create"} className="font-medium text-sm text-white/60 transition hover:text-white">Create Event</Link>
                        <NotificationsMenu variant="onDark" />
                        <UserMenu variant="onDark" />
                    </div>
                ) : (
                    <div className="flex flex-row items-center gap-5 rounded-full bg-white/90 px-5 py-1.5 text-black shadow-[0_10px_30px_-15px_rgba(0,0,0,0.35)] backdrop-blur">
                        <Link href={"/event/create"} className="font-medium text-sm text-black/60 transition hover:text-black">Create Event</Link>
                        <NotificationsMenu />
                        <UserMenu />
                    </div>
                ))
                :
                (isLanding ? (
                    <div className="flex flex-row items-center gap-1">
                        <Link href="/login" className="rounded-full px-4 py-1.5 font-medium text-sm text-white/60 transition hover:text-white">Login</Link>
                        <Link href="/register" className="ml-1 rounded-full bg-white px-4 py-1.5 font-medium text-sm text-[#17130e] transition hover:bg-white/90">Register</Link>
                    </div>
                ) : (
                    <div className="flex flex-row items-center gap-1 rounded-full bg-white/90 p-1.5 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.35)] backdrop-blur">
                        <Link href="/login" className="rounded-full px-4 py-1.5 font-medium text-sm text-black/60 transition hover:bg-black/5 hover:text-black">Login</Link>
                        <Link href="/register" className="ml-1 rounded-full bg-black px-4 py-1.5 font-medium text-sm text-white transition hover:bg-black/80">Register</Link>
                    </div>
                ))
            }
        </header>
    )
}
