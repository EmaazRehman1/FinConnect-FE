import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { CheckCircle, XCircle } from "lucide-react";
import Navbar from "@/components/Shared/Navbar";
import { useUser } from "@/context/UserContextProvider";
import finteckApi from "@/axios/Axios";

// Define pricing plans
const plans = [
  {
    id: "price_1RGTg2JvljWkaejrO0KzUhfR",
    name: "Basic",
    description: "For developers just getting started with financial APIs",
    price: {
      monthly: 20,
    },
    features: [
      { included: true, name: "Balance (20 requests/5 min)" },
      { included: true, name: "Transaction History" },
      { included: true, name: "Basic Documentation" },
      { included: true, name: "Community Support" },
      { included: false, name: "Transfer" },
      { included: false, name: "Invoice Generation API" },
      { included: false, name: "Advanced Analytics" },
      { included: false, name: "Priority Support" },
    ],
    popular: false,
    cta: "Subscribe Now",
  },
  {
    id: "price_1RGTh5JvljWkaejrRqfQ90TH",
    name: "Professional",
    description: "For growing businesses integrating financial services",
    price: {
      monthly: 49,
    },
    features: [
      { included: true, name: "Balance (50 requests/5 min)" },
      { included: true, name: "Full Transaction History " },
      { included: true, name: "Transfer" },
      { included: true, name: "Basic Invoice Generation" },
      { included: true, name: "Basic Analytics" },
      { included: true, name: "Email Support" },
      { included: false, name: "Advanced Analytics" },
      { included: false, name: "Priority Support" },
    ],
    popular: true,
    cta: "Subscribe Now",
  },
  {
    id: "price_1RGTihJvljWkaejrc5tdgZwl",
    name: "Enterprise",
    description: "For organizations requiring high-volume API access",
    price: {
      monthly: 199,
    },
    features: [
      { included: true, name: "Balance (100 requests/5 min)" },
      { included: true, name: "Full Transaction History" },
      { included: true, name: "Transfer" },
      { included: true, name: "Advanced Invoice Generation" },
      { included: true, name: "Advanced Analytics" },
      { included: true, name: "Priority Support" },
      { included: true, name: "Custom Rate Limits" },
      { included: true, name: "SLA Agreement" },
    ],
    popular: false,
    cta: "Subscribe Now",
  },
];

export default function PricingPage() {
  const navigate = useNavigate();

  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { accessToken, user } = useUser();
  console.log("USER", user);
  console.log("USER", accessToken);

  const handleSubscribe = async (planId: string) => {
    setSelectedPlan(planId);
    setIsLoading(true);

    try {
      if (!accessToken) {
        throw new Error("Access token is missing");
      }

      const response = await finteckApi.post(
        "/stripe/create-checkout-session",
        {
          priceId: planId,
          userEmail: "saimfayyaz124@gmail.com",
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      console.log(response);
      if (response.data.url) {
        window.location.href = response.data.url;
      }

      console.log(response.data);
    } catch (error) {
      console.error("Subscription error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 container max-w-screen-xl mx-auto px-4 py-12 md:py-24">
        <motion.div
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Choose the plan that fits your development needs, with no hidden
            fees or surprises.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.id}
              className={`bg-card border rounded-xl overflow-hidden ${
                plan.popular ? "shadow-lg border-blue-500" : "shadow-sm"
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{
                scale: 1.05,
                boxShadow:
                  "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                transition: {
                  type: "spring",
                  stiffness: 400,
                  damping: 15,
                },
              }}
            >
              {plan.popular && (
                <div className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-1.5 px-4 text-center text-sm font-medium">
                  Most Popular
                </div>
              )}

              <div className="p-6">
                <h3 className="text-2xl font-bold">{plan.name}</h3>
                <p className="text-muted-foreground mb-4">{plan.description}</p>

                <div className="mb-6">
                  <div className="flex items-end">
                    <span className="text-4xl font-bold">
                      ${plan.price.monthly}
                    </span>
                    <span className="text-muted-foreground ml-2 mb-1">
                      monthly
                    </span>
                  </div>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-3">
                      {feature.included ? (
                        <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                      ) : (
                        <XCircle className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                      )}
                      <span
                        className={
                          feature.included ? "" : "text-muted-foreground"
                        }
                      >
                        {feature.name}
                      </span>
                    </li>
                  ))}
                </ul>

                <Button
                  className={`w-full ${
                    plan.popular
                      ? "bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600"
                      : ""
                  }`}
                  variant={plan.popular ? "default" : "outline"}
                  onClick={() => handleSubscribe(plan.id)}
                  disabled={isLoading && selectedPlan === plan.id}
                >
                  {isLoading && selectedPlan === plan.id ? (
                    <span className="flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    plan.cta
                  )}
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-24 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">
            Frequently Asked Questions
          </h2>

          <div className="space-y-6">
            {[
              {
                question: "Can I change plans later?",
                answer:
                  "Yes, you can upgrade or downgrade your plan at any time. When upgrading, you'll be prorated for the remainder of your billing cycle. When downgrading, changes will take effect at the start of your next billing cycle.",
              },
              {
                question: "What happens if I exceed my rate limits?",
                answer:
                  "If you exceed your plan's rate limits, requests will return a 429 error code. You can view your current usage in the dashboard. We'll notify you when you're approaching your limits.",
              },
              {
                question: "Is there a free trial for paid plans?",
                answer:
                  "Yes! All paid plans come with a 14-day free trial. You won't be charged until the trial period ends. No credit card is required to start a trial.",
              },
              {
                question: "How do I cancel my subscription?",
                answer:
                  "You can cancel anytime from your account settings. Cancellations take effect at the end of your current billing period. You'll retain access to paid features until then.",
              },
              {
                question: "What payment methods do you accept?",
                answer:
                  "We accept all major credit cards (Visa, Mastercard, American Express) as well as PayPal. Enterprise customers can request invoice billing.",
              },
            ].map((faq, index) => (
              <motion.div
                key={index}
                className="border-b pb-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <h3 className="font-medium text-lg mb-2">{faq.question}</h3>
                <p className="text-muted-foreground">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <motion.div
        className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="container max-w-screen-xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Still have questions?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Our team is happy to help you choose the right plan for your needs.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button
              variant="outline"
              className="bg-transparent hover:bg-white/10 border-white text-white"
            >
              Contact Support
            </Button>
            <Button variant="secondary" asChild>
              <Link to="/docs">Read Documentation</Link>
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
