'use client'
import { cn } from "@/lib/utils";
import Logo from "./Logo";
import Link from "next/link";
import UserMenu from "./UserMenu";
import NotificationsMenu from "./NotificationsMenu";
import { useAuth } from "../auth/AuthContext";

export default function NavBar({ className }: { className: string }) {
    const { isAuthenticated } = useAuth();
    return (
        <header className={cn(className, "px-6 py-4 flex justify-between items-center")}>
            <Link href="/" className="inline-flex items-center gap-3">
                <Logo className="h-7 w-7" />
                <span className="font-display text-lg font-medium text-zinc-900">EventX</span>
            </Link>
            {isAuthenticated ?
                <div className="flex flex-row gap-6 items-center">
                    <Link href={"/event/create"} className="font-medium text-sm hover:text-primary text-zinc-600 transition">Create Event</Link>
                    <NotificationsMenu />
                    <UserMenu />
                </div>
                :
                <div className="flex flex-row items-center">
                    <Link href="/login" className="font-medium text-sm hover:text-primary text-zinc-600 transition">Login</Link>
                    <Link href="/register" className="ml-5 font-medium text-sm transition bg-primary text-white py-2 px-5 rounded-full hover:bg-primary-strong active:scale-[0.98]">Register</Link>
                </div>
            }
        </header>
    )
}