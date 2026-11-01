import React from "react";
import { cn } from "@/lib/utils";
import Container, { ContainerWidth } from "@/components/ui/Container";

export type SectionBg = "charcoal" | "forest" | "deep" | "sand";

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  id?: string;
  bg?: SectionBg;
  containerWidth?: ContainerWidth;
  withTopBorder?: boolean;
  withTopoGrid?: boolean;
  sectionIndex?: string;
  sectionMeta?: string;
  children: React.ReactNode;
}

export default function Section({
  id,
  bg = "charcoal",
  containerWidth = "default",
  withTopBorder = true,
  withTopoGrid = false,
  sectionIndex,
  sectionMeta,
  children,
  className,
  ...props
}: SectionProps) {
  const bgStyles: Record<SectionBg, string> = {
    charcoal: "bg-[#151916] text-[#F8F7F2]",
    forest: "bg-[#183D32] text-[#F8F7F2]",
    deep: "bg-[#0B0E0C] text-[#F8F7F2]",
    sand: "bg-[#EDE5D5] text-[#151916]",
  };

  const borderStyles: Record<SectionBg, string> = {
    charcoal: "border-[#EDE5D5]/15",
    forest: "border-[#A3A879]/25",
    deep: "border-[#EDE5D5]/10",
    sand: "border-[#151916]/15",
  };

  return (
    <section
      id={id}
      className={cn(
        "relative py-20 sm:py-28 md:py-36 overflow-hidden",
        bgStyles[bg],
        withTopBorder && `border-t ${borderStyles[bg]}`,
        withTopoGrid && "bg-topo-grid",
        className
      )}
      {...props}
    >
      {(sectionIndex || sectionMeta) && (
        <div className="absolute top-6 left-6 right-6 hidden sm:flex justify-between items-center font-mono text-[11px] tracking-widest uppercase opacity-40 select-none pointer-events-none">
          {sectionIndex && <span>{sectionIndex}</span>}
          {sectionMeta && <span>{sectionMeta}</span>}
        </div>
      )}
      <Container width={containerWidth}>{children}</Container>
    </section>
  );
}
