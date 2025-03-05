
import React from "react";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function Logo({ className, size = "md" }: LogoProps) {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-16 w-16",
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <img 
        src="/src/assets/logo.jpg" 
        alt="Le Unike" 
        className={cn("rounded-full object-cover", sizeClasses[size])}
      />
      <span className="font-bold text-xl text-frozen-dark">Le Unike</span>
    </div>
  );
}
