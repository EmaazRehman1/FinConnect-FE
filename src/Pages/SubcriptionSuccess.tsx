import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle } from "lucide-react";
import { useUser } from "@/context/UserContextProvider";

export const SubscriptionSuccess = () => {
  const { fetchUser } = useUser();

  const goToDashboard = () => {
    fetchUser();
  };
  return (
    <section className="py-20 md:py-32 bg-gradient-to-b from-background to-blue-50 dark:to-blue-950/30">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="mb-8"
          >
            <CheckCircle className="h-24 w-24 text-green-500" />
          </motion.div>

          <motion.h1
            className="text-3xl md:text-5xl font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
              Subscription Successful!
            </span>
          </motion.h1>

          <motion.p
            className="text-lg md:text-xl mb-8 text-muted-foreground"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            Thank you for subscribing to our premium plan. Your account has been
            successfully activated and you now have access to all our premium
            features.
          </motion.p>

          <motion.div
            className="flex flex-col gap-4 items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <motion.div
              className="w-full max-w-md p-6 bg-white dark:bg-slate-900 rounded-lg shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <div className="text-left mb-4">
                <h3 className="font-bold text-lg mb-2">
                  Your Subscription Details:
                </h3>
                <p className="text-muted-foreground">
                  Plan: <span className="font-semibold">Premium</span>
                </p>
                <p className="text-muted-foreground">
                  Status:{" "}
                  <span className="text-green-500 font-semibold">Active</span>
                </p>
                <p className="text-muted-foreground">
                  Next billing date:{" "}
                  <span className="font-semibold">May 22, 2025</span>
                </p>
              </div>
            </motion.div>

            <motion.div
              className="mt-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                onClick={goToDashboard}
                to="/dashboard"
                className="inline-flex items-center justify-center px-8 py-3 rounded-md font-medium text-white bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 shadow-md"
              >
                Go to Dashboard
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </motion.div>

            <motion.p
              className="text-sm text-muted-foreground mt-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              An email confirmation has been sent to your registered email
              address.
            </motion.p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default SubscriptionSuccess;
