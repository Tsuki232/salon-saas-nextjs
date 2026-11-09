"use client";

import { motion } from "motion/react";

export function Card({
  children,
  className = "",
  hover = false,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay, ease: [0.16, 1, 0.3, 1] }}
      whileHover={hover ? { y: -4 } : undefined}
      className={`glass rounded-2xl p-5 transition-shadow ${
        hover ? "cursor-pointer hover:shadow-2xl" : ""
      } ${className}`}
    >
      {children}
    </motion.div>
  );
}
