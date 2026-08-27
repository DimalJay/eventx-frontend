import { cn } from "@/lib/utils";
import Image from "next/image";

export default function Logo({
  className = "h-10 w-10",
  variant = "default",
}: {
  className?: string;
  variant?: "default" | "inverted";
}) {
  return (
    <Image
      src={variant === "inverted" ? "/images/logo-mark-inverted.svg" : "/images/logo-mark.svg"}
      alt="EventX"
      width={40}
      height={40}
      className={cn(className)}
    />
  );
}
