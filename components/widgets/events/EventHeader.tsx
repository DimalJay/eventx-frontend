import Link from "next/link";
import Logo from "../Logo";

<<<<<<< HEAD
<<<<<<< HEAD
interface EventHeaderProps {
    id: string | string[] | undefined;
}

export default function EventHeader({ id }: EventHeaderProps) {
=======
export default function EventHeader() {
    const { id } = useParams();
>>>>>>> 94b8d3c6a2f6bbb4cb42fd05148ed50e3301db67
=======
export default function EventHeader({ id }: { id: string }) {
>>>>>>> cd3b821c7fc8714cc6168ae3e3b460424d62580f
    return (
        <header className="">
            <div className="flex flex-row justify-between">
                <div className="flex items-center gap-3">
                    <Logo />
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-black/50">
                            EventX live dashboard
                        </p>
                        <p className="text-2xl font-semibold tracking-tight text-black">
                            Signal Summit 2026
                        </p>
                    </div>
                </div>
                <Link href={`/event/${id}`} className="btn">
                    View Event
                </Link>
            </div>
        </header>
    )
}