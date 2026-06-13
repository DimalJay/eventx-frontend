import { cn } from "@/lib/utils";
import Image from "next/image";

export default function Logo({ className = "h-10 w-10" }: { className?: string }) {
  return (
    <Image
      src="/images/logo-mark.svg"
      alt="EventX"
      width={40}
      height={40}
      className={cn(className)}
    />
  );
}
