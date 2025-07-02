// components/animations/AnimatedContainer.tsx
"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface AnimatedContainerProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
}

const AnimatedContainer = ({
  children,
  delay = 0.1,
  duration = 0.6,
}: AnimatedContainerProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedContainer;
