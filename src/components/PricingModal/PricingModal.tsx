import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CheckCircle, XCircle } from "lucide-react";
import finteckApi from "@/axios/Axios";
import toast from "react-hot-toast";

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

export default function PricingModal({
  open,
  onOpenChange,

  accessToken,
  currentSub,
  setCurrentSub,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("");
  const handleSubscribe = async (planId) => {
    setSelectedPlan(planId);
    setIsLoading(true);

    try {
      const response = await finteckApi.post(
        "/stripe/update-subscription",
        {
          newPriceId: planId,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setCurrentSub(response.data.subscription);
      onOpenChange();
      toast.success("Subscription Updated.");
      console.log("Subscribing to plan:", response.data.subscription);
    } catch (error) {
      console.error("Subscription error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full !max-w-[800px] p-0 overflow-auto !max-h-[700px]">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="text-2xl font-bold text-center">
            Change Plans
          </DialogTitle>
        </DialogHeader>

        <div className="p-6">
          <div className="grid md:grid-cols-3 gap-4">
            {plans.map((plan, index) => {
              const isCurrentPlan = currentSub?.plan === plan.id;

              const isNextPlan =
                currentSub?.nextPlan === plan.id &&
                currentSub?.plan !== currentSub?.nextPlan;

              const noChange = currentSub?.plan === currentSub?.nextPlan;
              const showButton = !(isCurrentPlan && noChange) && !isNextPlan;
              return (
                <motion.div
                  key={plan.id}
                  className={`bg-card border rounded-xl overflow-hidden ${
                    isCurrentPlan ? "border-blue-500 shadow-md" : ""
                  }`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  {isCurrentPlan && (
                    <div className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-1 px-4 text-center text-sm font-medium">
                      Current
                    </div>
                  )}

                  {isNextPlan && (
                    <div className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-1 px-4 text-center text-sm font-medium">
                      Next
                    </div>
                  )}

                  <div className="p-4">
                    <h3 className="text-xl font-bold">{plan.name}</h3>
                    <p className="text-muted-foreground text-sm mb-3">
                      {plan.description}
                    </p>

                    <div className="mb-4">
                      <div className="flex items-end">
                        <span className="text-3xl font-bold">
                          ${plan.price.monthly}
                        </span>
                        <span className="text-muted-foreground ml-2 mb-1 text-sm">
                          monthly
                        </span>
                      </div>
                    </div>

                    <ul className="space-y-2 mb-6 text-sm">
                      {plan.features.map((feature, featureIndex) => (
                        <li
                          key={featureIndex}
                          className="flex items-center gap-2"
                        >
                          {feature.included ? (
                            <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                          ) : (
                            <XCircle className="h-4 w-4 text-muted-foreground flex-shrink-0" />
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

                    {showButton && (
                      <Button
                        className={`w-full ${
                          plan.popular
                            ? "bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600"
                            : ""
                        }`}
                        variant={plan.popular ? "default" : "outline"}
                        onClick={() => handleSubscribe(plan.id)}
                        disabled={isLoading && selectedPlan === plan.id}
                        size="sm"
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
                        ) : isCurrentPlan ? (
                          "Activate Again"
                        ) : (
                          "Subscribe Now"
                        )}
                      </Button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div className="mt-6 text-center text-muted-foreground text-sm">
            You will be charged next month with this plan.
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
