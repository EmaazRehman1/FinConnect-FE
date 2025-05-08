import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Toaster, toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
// import { toast } from '@/components/ui/use-toast';
import { LoaderCircle, Lock } from "lucide-react";
import Navbar from "@/components/Shared/Navbar";
import finteckApi from "@/axios/Axios";
import { useUser } from "@/context/UserContextProvider";

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(1, {
    message: "Password is required.",
  }),
});

export default function LoginPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { setUser, setAccessToken } = useUser();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const response = await finteckApi.post("/user/login", values);
      const data = response.data;
      console.log(data);

      if (data.user.role === "admin") {
        const userObj = {
          isAuthenticated: true,
          ...data.user,
          isSubscribed: true,
        };
        setUser(userObj);
        setAccessToken(data.accessToken);
        // navigate("/admin/dashboard");
        toast.success("Login successfull");
      } else if (data.user.role === "developer") {
        if (data.user.isSubscribed) {
          const userObj = {
            isAuthenticated: true,
            ...data.user,
          };
          console.log(userObj);

          setUser(userObj);
          setAccessToken(data.accessToken);
          // navigate("/dashboard");
          toast.success("Login successfull");
        } else {
          console.log("NOT SUBS");

          const userObj = {
            isAuthenticated: true,
            ...data.user,
          };
          console.log(userObj);

          setUser(userObj);
          setAccessToken(data.accessToken);
          // navigate("/pricing");
        }
      }

      // if (data.user.isSubscribed) {
      //   navigate('/dashboard');

      //   } else if (data.user.role === "developer") {
      //     const userObj = {
      //       isAuthenticated: true,
      //       ...data.user,
      //     };
      //     console.log(userObj);

      //     setUser(userObj);
      //     setAccessToken(data.accessToken);
      //     navigate("/dashboard");
      //     toast.success("Login successfull");
      //   }
      // } else {
      //   // navigate("/pricing");
      //   navigate("/dashboard");

      // }
    } catch (error: any) {
      // console.log(error)
      toast.error(error.response.data.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <Toaster position="top-center" />
      <div className="flex-1 container max-w-screen-xl mx-auto px-4 py-12 md:py-24">
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          <motion.div
            className="flex-1 max-w-md"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center lg:text-left">
              <h1 className="text-3xl md:text-4xl font-bold mb-6">
                Welcome Back
              </h1>
              <p className="text-muted-foreground text-lg mb-8">
                Log in to access your FinConnect dashboard.
              </p>
            </div>

            <div className="bg-card border rounded-xl p-6 shadow-sm">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
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
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex items-center justify-between">
                    <div className="text-sm">
                      <Link
                        to="/forgot-password"
                        className="text-blue-600 hover:text-blue-500"
                      >
                        Forgot password?
                      </Link>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                        Logging in...
                      </>
                    ) : (
                      "Sign in"
                    )}
                  </Button>
                </form>
              </Form>

              <div className="mt-6 text-center text-sm">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  Sign up for free
                </Link>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="hidden lg:block flex-1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="relative">
              <div className="absolute -top-6 -left-6 w-64 h-64 bg-blue-200 dark:bg-blue-900/20 rounded-full filter blur-3xl opacity-30"></div>
              <div className="absolute -bottom-6 -right-6 w-64 h-64 bg-cyan-200 dark:bg-cyan-900/20 rounded-full filter blur-3xl opacity-30"></div>

              <div className="relative bg-card border rounded-xl p-8 shadow-lg">
                <div className="flex justify-center mb-6">
                  <div className="rounded-full bg-blue-100 dark:bg-blue-900/30 p-4">
                    <Lock className="h-8 w-8 text-blue-600" />
                  </div>
                </div>

                <h2 className="text-2xl font-semibold text-center mb-6">
                  Secure Access to Financial transactions
                </h2>

                <div className="space-y-4">
                  <div className="bg-muted/50 rounded-lg p-4">
                    <div className="text-sm font-medium">
                      API Authentication
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      All requests are authenticated with strong encryption.
                    </div>
                  </div>

                  <div className="bg-muted/50 rounded-lg p-4">
                    <div className="text-sm font-medium">
                      Role-Based Access Control
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Fine-grained permissions ensure you only access what you
                      need.
                    </div>
                  </div>

                  <div className="bg-muted/50 rounded-lg p-4">
                    <div className="text-sm font-medium">
                      Transaction Logging
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      All transactions are securely logged.
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t">
                  <div className="text-center text-sm text-muted-foreground">
                    We use industry-standard security practices to protect your
                    data.
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
