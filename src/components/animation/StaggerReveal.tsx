"use client";

import React from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";

interface StaggerRevealProps {
  children: React.ReactNode;
  delay?: number;
  staggerChildren?: number;
  className?: string;
  direction?: "up" | "down" | "left" | "right" | "none";
}

export default function StaggerReveal({
  children,
  delay = 0,
  staggerChildren = 0.1,
  className = "",
  direction = "up",
}: StaggerRevealProps) {
  const shouldReduceMotion = useReducedMotion();

  const getInitialOffset = () => {
    if (shouldReduceMotion || direction === "none") return { x: 0, y: 0 };
    switch (direction) {
      case "up":
        return { x: 0, y: 35 };
      case "down":
        return { x: 0, y: -35 };
      case "left":
        return { x: 35, y: 0 };
      case "right":
        return { x: -35, y: 0 };
    }
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: delay,
        staggerChildren: staggerChildren,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: {
      opacity: 0,
      ...getInitialOffset(),
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.215, 0.61, 0.355, 1] as [number, number, number, number],
      },
    },
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={containerVariants}
      className={className}
    >
      {React.Children.map(children, (child) => (
        <motion.div variants={itemVariants}>{child}</motion.div>
      ))}
    </motion.div>
  );
}
