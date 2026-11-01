"use client";

import React, { useEffect, useState } from "react";
import { Compass } from "lucide-react";
import { cn } from "@/lib/utils";

interface CompassIndicatorProps {
  className?: string;
  coordinates?: string;
  elevation?: string;
}

export default function CompassIndicator({
  className,
  coordinates = "32.2396° N, 77.1887° E",
  elevation = "15,060 FT",
}: CompassIndicatorProps) {
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const xRatio = (e.clientX / innerWidth - 0.5) * 2;
      const yRatio = (e.clientY / innerHeight - 0.5) * 2;
      const angle = Math.atan2(yRatio, xRatio) * (180 / Math.PI);
      setRotation(angle);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div
      className={cn(
        "inline-flex items-center gap-3 px-3 py-1.5 border border-[#EDE5D5]/20 bg-[#1E2420]/80 backdrop-blur-md text-[#EDE5D5] select-none",
        className
      )}
    >
      <div className="relative w-5 h-5 flex items-center justify-center">
        <div
          className="transition-transform duration-300 ease-out text-[#FF7135]"
          style={{ transform: `rotate(${rotation}deg)` }}
        >
          <Compass className="w-5 h-5" strokeWidth={1.75} />
        </div>
      </div>
      <div className="flex flex-col text-[10px] font-mono leading-tight tracking-wider uppercase">
        <span className="text-[#EDE5D5]/90">{coordinates}</span>
        <span className="text-[#A3A879]">ELEV: {elevation}</span>
      </div>
    </div>
  );
}
