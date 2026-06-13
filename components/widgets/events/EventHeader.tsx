import Link from "next/link";

export default function EventHeader() {
    return (
        <header className="">
            <div className="flex flex-row justify-between">
                <div className="flex items-center gap-3">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-black text-sm font-semibold uppercase tracking-widest text-white">
                        EX
                    </span>
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-black/50">
                            EventX live dashboard
                        </p>
                        <p className="text-2xl font-semibold tracking-tight text-black">
                            Signal Summit 2026
                        </p>
                    </div>
                </div>
                <Link href="/event/123" className="btn">
                    View Event
                </Link>
            </div>
        </header>
    )
}