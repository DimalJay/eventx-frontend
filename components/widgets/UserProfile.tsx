import Link from "next/link";
import { useAuth } from "../auth/AuthContext";

export default function UserProfile() {
    const { user, isAuthenticated, logout } = useAuth();
    return (<>{!isAuthenticated ? (
        <div className="flex flex-row gap-3">
            <Link className="flex h-12 items-center justify-center rounded-full bg-black px-6 text-sm font-semibold uppercase tracking-widest text-white transition hover:bg-black/90" href="/login">
                Login
            </Link>
            <Link className="flex h-12 items-center justify-center rounded-full border border-black/20 px-6 text-sm font-semibold uppercase tracking-widest text-black transition hover:border-black hover:bg-black/5" href="/register">
                Register
            </Link>
        </div>
    ) : (
        <div className="flex items-center gap-3">
            <Link
                href="/home"
                className="group flex items-center gap-3 rounded-full border border-black/10 bg-white/70 py-1.5 pl-1.5 pr-5 shadow-[0_12px_36px_-26px_rgba(0,0,0,0.5)] backdrop-blur transition hover:border-black/30 hover:bg-white"
            >
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-black text-sm font-semibold uppercase tracking-widest text-white">
                    {user?.firstName?.charAt(0).toUpperCase() ?? "U"}
                </span>
                <span className="flex flex-col leading-tight">
                    <span className="text-sm font-semibold text-black">
                        {user?.firstName ?? "User"}
                    </span>
                    <span className="text-xs text-black/40 transition group-hover:text-black/60">
                        View profile
                    </span>
                </span>
            </Link>

        </div>
    )}</>);
 
}
