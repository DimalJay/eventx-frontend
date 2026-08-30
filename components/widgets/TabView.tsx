
import Link from "next/link";
import { usePathname } from "next/navigation";
export function TabItem({ url, children, name }: { url: string, children: React.ReactNode, name: string }) {
    const pathname = usePathname();
    const pageName = pathname.split("/").filter(Boolean).pop() || "overview";
    return <Link href={url} className="tab-item" data-selected={pageName == name}>
        {children}
    </Link>;
}
export default function TabView({ children, defaultPage }: { children: React.ReactNode, defaultPage: string }) {
    return (
        <div className="flex flex-row gap-4 max-w-6xl border-b border-zinc-200 overflow-x-auto">
            {children}
        </div>
    )
}