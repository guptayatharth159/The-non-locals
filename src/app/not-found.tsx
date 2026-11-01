export const runtime = "edge";

import Link from "next/link";
import { Compass, ArrowLeft } from "lucide-react";
import Button from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#151916] text-[#F8F7F2] flex flex-col items-center justify-center p-6 text-center select-none bg-topo-grid">
      <div className="w-16 h-16 border border-[#FF7135]/40 bg-[#1E2420] flex items-center justify-center mb-6 text-[#FF7135]">
        <Compass className="w-8 h-8 animate-spin" style={{ animationDuration: "12s" }} />
      </div>

      <span className="font-mono text-xs tracking-[0.3em] uppercase text-[#FF7135] mb-2">
        // 404 TRAIL NOT FOUND
      </span>

      <h1 className="font-display text-6xl sm:text-8xl md:text-9xl text-[#F8F7F2] uppercase tracking-tight mb-4 leading-none">
        OFF THE MAP
      </h1>

      <p className="font-body text-[#EDE5D5]/80 text-base sm:text-lg max-w-md mb-8 leading-relaxed">
        You wandered past the ridgeline marker. The coordinates you’re looking for don’t exist in this sector.
      </p>

      <Button
        variant="primary"
        size="lg"
        href="/"
        icon={<ArrowLeft className="w-4 h-4" />}
        iconPosition="left"
      >
        RETURN TO BASECAMP
      </Button>
    </div>
  );
}
