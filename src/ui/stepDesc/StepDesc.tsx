"use client";

import { clsMerge } from "@/helpers";
import { AnimatePresence, motion } from "framer-motion";
import { HTMLAttributes } from "react";

interface Props extends HTMLAttributes<HTMLDivElement> {
  desc: string;
}
export default function StepDesc({ desc, ...props }: Props) {
  const { className, ...rest } = props;
  return (
    <div {...rest} className={clsMerge(className, "text-primary font-medium")}>
      <AnimatePresence mode="wait">
        <motion.p
          key={desc}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
        >
          {desc}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}
