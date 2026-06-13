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
        <header className={cn(className, "text-black px-4 py-4 flex justify-between items-center")}>
            <Link href="/" className="inline-flex items-center gap-4">
                <Logo className="h-8 w-8" />
                <span className="font-semibold">EventX</span>
            </Link>
            {isAuthenticated ?
                <div className="flex flex-row gap-6 items-center">
                    <Link href={"/event/create"} className="font-medium text-sm hover:text-black text-black/60 transition">Create Event</Link>
                    <NotificationsMenu />
                    <UserMenu />
                </div>
                :
                <div className="flex flex-row items-center px-8">
                    <Link href="/login" className="font-medium text-sm hover:text-black text-black/60 transition">Login</Link>
                    <Link href="/register" className="ml-4 font-medium text-sm transition bg-black text-white py-1.5 px-4 rounded-full hover:bg-black/80">Register</Link>
                </div>
            }
        </header>
    )
}