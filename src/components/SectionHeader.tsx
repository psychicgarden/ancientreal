import * as React from "react";
import { cn } from "@/lib/utils";
interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  subtitle?: React.ReactNode;
  align?: "left" | "center";
  className?: string;
}
export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  align = "center",
  className
}: SectionHeaderProps) {
  return <header className={cn("mx-auto max-w-4xl space-y-3 animate-fade-in", align === "center" ? "text-center" : "text-left", className)}>
      {eyebrow && <p className="text-xs tracking-widest uppercase text-muted-foreground/80">{eyebrow}</p>}
      <h2 className="text-3xl md:text-4xl font-semibold tracking-tight leading-tight">{title}</h2>
      {subtitle && <p className="text-lg text-muted-foreground leading-relaxed py-0 my-[30px] mb-[50px]">{subtitle}</p>}
    </header>;
}
export default SectionHeader;