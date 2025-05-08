import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ArrowRight, CheckCircle, LoaderCircle } from "lucide-react";
import Navbar from "@/components/Shared/Navbar";
import finteckApi from "@/axios/Axios"; // Adjust the import path as necessary
import { useUser } from "@/context/UserContextProvider";
import toast from "react-hot-toast";
import { Toaster } from "react-hot-toast";
const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
});

export default function RegisterPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  const { setUser, setAccessToken } = useUser();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);

    const data = {
      fullName: values.name,
      email: values.email,
      role: "developer",
      password: values.password,
    };

    try {
      // 1. Register the user
      const response = await finteckApi.post("/user/register", data, {
        withCredentials: true,
      });

      console.log("Registration successful:", response.data);

      const { accessToken, user } = response.data;
      const userObj = {
        isAuthenticated: true,
        ...user,
      };
      setUser(userObj);
      setAccessToken(accessToken);
      // 2. Create the account using access token
      const accountResponse = await finteckApi.post(
        "/account/create-account",
        { userId: user.id }, // include optional cnic if needed
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      console.log("Account creation successful:", accountResponse.data);
  
      setStep(2);
      // TODO: Show success toast, redirect, or set user context
      toast.success(response.data.message)
    } catch (error: any) {
      console.error(
        "Error during registration or account creation:",
        error.response?.data || error.message
      );
      toast.error(error.response.data.message)
      
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <Toaster position="top-center"/>
      <div className="flex-1 container max-w-screen-xl mx-auto px-4 py-12 md:py-24">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 items-center">
          <motion.div
            className="flex-1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl md:text-4xl font-bold mb-6">
              Create Your FinConnect Account
            </h1>
            <p className="text-muted-foreground text-lg mb-8">
              Join thousands of developers building the future of finance with
              our platform.
            </p>

            {step === 1 ? (
              <div className="bg-card border rounded-xl p-6 shadow-sm max-w-md">
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                  >
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="John Doe"
                              {...field}
                              disabled={isLoading}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="john.doe@example.com"
                              type="email"
                              {...field}
                              disabled={isLoading}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="••••••••"
                              type="password"
                              {...field}
                              disabled={isLoading}
                            />
                          </FormControl>
                          <FormDescription>
                            Must be at least 8 characters
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                          Creating Account...
                        </>
                      ) : (
                        <>
                          Create Account
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </form>
                </Form>

                <div className="mt-6 text-center text-sm">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="font-medium text-blue-600 hover:text-blue-500"
                  >
                    Log in
                  </Link>
                </div>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-card border rounded-xl p-8 shadow-sm max-w-md text-center"
              >
                <div className="mb-4 flex justify-center">
                  <CheckCircle className="h-16 w-16 text-green-500" />
                </div>
                <h2 className="text-2xl font-semibold mb-2">
                  Registration Successful!
                </h2>
                <p className="text-muted-foreground mb-6">
                  Your account has been created.
                </p>
                <Button
                  onClick={() => navigate("/pricing")}
                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600"
                >
                  Continue to Pricing
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </motion.div>
            )}
          </motion.div>

          <motion.div
            className="flex-1 max-w-lg"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="bg-blue-50 dark:bg-blue-950/30 rounded-2xl p-8">
              <h2 className="text-2xl font-semibold mb-6">
                Why Join FinConnect?
              </h2>

              <ul className="space-y-4">
                {[
                  {
                    title: "Powerful Financial Transactions",
                    description:
                      "Access transactions, balances, transfers, and invoicing capabilities through a unified platform.",
                  },
                  {
                    title: "Flexible Subscription Plans",
                    description:
                      "Choose from multiple tiers to match your application's needs and scale as you grow.",
                  },
                  {
                    title: "Developer-First Experience",
                    description:
                      "Clean documentation, robust SDKs, and responsive support to help you build faster.",
                  },
                  {
                    title: "Sandbox Environment",
                    description:
                      "Test and iterate with our fully-featured sandbox before going to production.",
                  },
                ].map((item, index) => (
                  <motion.li
                    key={index}
                    className="flex gap-3"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.1, duration: 0.3 }}
                  >
                    <div>
                      <CheckCircle className="h-6 w-6 text-green-500 mt-0.5" />
                    </div>
                    <div>
                      <h3 className="font-medium">{item.title}</h3>
                      <p className="text-muted-foreground text-sm">
                        {item.description}
                      </p>
                    </div>
                  </motion.li>
                ))}
              </ul>

              <div className="mt-8">
                <blockquote className="italic text-muted-foreground border-l-4 border-blue-500 pl-4">
                  "FinConnect has revolutionized how we handle financial data
                  integration. Our development time was cut in half."
                  <footer className="mt-2 font-medium not-italic">
                    — Sarah Chen, CTO at TechFin
                  </footer>
                </blockquote>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
