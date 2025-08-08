import React from "react";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  className?: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ eyebrow, title, subtitle, align = "left", className }) => {
  const isCenter = align === "center";
  return (
    <header className={cn(isCenter ? "text-center" : "text-left", className)}>
      {eyebrow && (
        <div className={cn(
          "inline-flex items-center rounded-full border border-border/60 bg-background/60 px-3 py-1 text-xs tracking-wide text-muted-foreground backdrop-blur-sm",
          isCenter ? "mx-auto" : ""
        )}>
          {eyebrow}
        </div>
      )}
      <h2 className={cn(
        "mt-3 bg-gradient-primary bg-clip-text text-transparent font-normal leading-tight",
        "text-3xl md:text-4xl lg:text-5xl"
      )}>
        {title}
      </h2>
      {subtitle && (
        <p className={cn(
          "mt-4 text-base md:text-xl text-muted-foreground max-w-3xl",
          isCenter ? "mx-auto" : ""
        )}>
          {subtitle}
        </p>
      )}
    </header>
  );
};

export default SectionHeader;
