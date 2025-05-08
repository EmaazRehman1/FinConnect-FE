// components/FullPageLoader.tsx
import { motion } from "framer-motion";

export default function FullPageLoader() {
  return (
    <section className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-b from-background to-blue-50 dark:to-blue-950/30">
      {/* Animated logo + brand */}
      <motion.div
        className="flex flex-col items-center text-center"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        {/* Gradient square logo with “FC” */}
        <motion.div
          initial={{ rotate: -10 }}
          animate={{ rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="mb-6 select-none"
        >
          <div className="bg-gradient-to-r from-blue-600 to-cyan-400 h-16 w-16 rounded-lg flex items-center justify-center shadow-lg">
            <span className="text-3xl font-extrabold text-white">FC</span>
          </div>
        </motion.div>

        {/* Brand name */}
        <motion.h1
          className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent"
          initial={{ y: 15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          FinConnect
        </motion.h1>

        {/* Loading copy */}
        <motion.p
          className="mt-2 text-muted-foreground"
          initial={{ y: 15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Loading&hellip;
        </motion.p>
      </motion.div>
    </section>
  );
}
