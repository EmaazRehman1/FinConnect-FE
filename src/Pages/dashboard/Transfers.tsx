import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  ArrowRightLeft,
  AlertCircle,
  CheckCircle,
  RefreshCw,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { useUser } from "@/context/UserContextProvider";
import finteckApi from "@/axios/Axios";
import toast from "react-hot-toast";
import { Toaster } from "react-hot-toast";
// Mock account data
const mockAccounts = [
  { id: "acc_123456", name: "Main Account", balance: 12489.32 },
  { id: "acc_789012", name: "Savings Account", balance: 34567.89 },
  { id: "acc_345678", name: "Investment Account", balance: 56789.01 },
];

// Form schema
const transferSchema = z
  .object({
    sourceAccountId: z.string({
      required_error: "Please select a source account",
    }),
    destinationAccountId: z.string({
      required_error: "Please select a destination account",
    }),
    amount: z.coerce
      .number()
      .positive("Amount must be positive")
      .min(0.01, "Amount must be at least 0.01"),
    description: z.string().optional(),
  })
  .refine((data) => data.sourceAccountId !== data.destinationAccountId, {
    message: "Source and destination accounts must be different",
    path: ["destinationAccountId"],
  });

const Transfers = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState<boolean | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [transactionId, setTransactionId] = useState<string | null>(null);
  const [balance, setBalance] = useState(0);
  const { user, accessToken, logout } = useUser();

  const form = useForm<z.infer<typeof transferSchema>>({
    resolver: zodResolver(transferSchema),
    defaultValues: {
      sourceAccountId: "",
      destinationAccountId: "",
      amount: undefined,
      description: "",
    },
  });

  // const getAccountBalance = (accountId: string) => {
  //   const account = mockAccounts.find(acc => acc.id === accountId);
  //   return account ? account.balance : 0;
  // };

  const onSubmit = async (data: z.infer<typeof transferSchema>) => {
    setIsSubmitting(true);
    setSubmitSuccess(null);
    setErrorMessage(null);

    if (user?.id === data.destinationAccountId) {
      toast.error("Sender and Receiver Id Can't be Same.");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await finteckApi.post(
        "/account/transfer-money",
        {
          senderId: user?.id,
          receiverId: data.destinationAccountId,
          amount: data.amount,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      console.log(response);
      setSubmitSuccess(true);
      toast.success(response.data.message);
      setBalance(response.data.senderBalance);
      handleInvoice(
        response.data.senderId,
        response.data.receiverId,
        response.data.amountTransferred
      );
      form.reset();
    } catch (error: any) {
      setSubmitSuccess(false);
      console.error(error);

      toast.error(error.response.data.message);
      if (error.response.status === 429) {
        logout();
      }
      setErrorMessage(
        error?.response?.data?.message || "Transfer failed. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };
  const didCheckBalance = useRef(false);

  useEffect(() => {
    if (!didCheckBalance.current) {
      didCheckBalance.current = true;
      checkBalance();
    }
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const checkBalance = async () => {
    const userId = user?.id;
    console.log("ACCESS", accessToken);

    try {
      const response = await finteckApi.post(
        "/account/check-balance",
        { userId },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setBalance(response.data.balance);
      console.log("Your balance is:", response.data.balance);
    } catch (error: any) {
      toast.error(error.response.data.message);
      if (error.response.status === 429) {
        logout();
      }
      console.error("Failed to check balance", error);
    }
  };

  const handleInvoice = async (senderId: any, receiverId: any, amount: any) => {
    console.log("Invoice params:", senderId, receiverId, amount);

    try {
      const response = await finteckApi.post(
        "/invoice/generate-invoice",
        {
          senderAccountId: senderId,
          receiverAccountId: receiverId,
          amount: amount,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      console.log("generateinvoice", response);
    } catch (error: any) {
      toast.error(error.response.data.message);
      console.error("generateinvoice", error);
    }
  };
  const sourceAccountId = form.watch("sourceAccountId");
  const destinationAccountId = form.watch("destinationAccountId");
  const sourceAccount = mockAccounts.find((acc) => acc.id === sourceAccountId);
  const destinationAccount = mockAccounts.find(
    (acc) => acc.id === destinationAccountId
  );

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Transfer Funds</h1>
      <Toaster position="top-center" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          className="lg:col-span-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ArrowRightLeft className="h-5 w-5" />
                New Transfer
              </CardTitle>
              <CardDescription>
                Enter account IDs to transfer funds.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {submitSuccess === true ? (
                <Alert className="bg-green-500/10 text-green-500 border-green-500/20">
                  <CheckCircle className="h-4 w-4" />
                  <AlertTitle>Transfer Successful</AlertTitle>
                  <AlertDescription>
                    Your transfer has been processed successfully.
                    <br />
                  </AlertDescription>
                </Alert>
              ) : (
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                  >
                    {errorMessage && (
                      <Alert
                        variant="destructive"
                        className="flex flex-col justify-center items-start"
                      >
                        <div className="flex items-center gap-2">
                          <AlertCircle className="h-4 w-4" />
                          <AlertTitle>Error</AlertTitle>
                        </div>
                        <AlertDescription>{errorMessage}</AlertDescription>
                      </Alert>
                    )}

                    <FormField
                      control={form.control}
                      name="sourceAccountId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Source Account ID</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g. acc_123456"
                              {...field}
                              disabled={true}
                              value={user?.id}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="destinationAccountId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Destination Account ID</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g. acc_789012"
                              {...field}
                              disabled={isSubmitting}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="amount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Amount</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                                $
                              </span>
                              <Input
                                {...field}
                                type="number"
                                step="0.01"
                                placeholder="0.00"
                                className="pl-8"
                                disabled={isSubmitting}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        "Transfer Funds"
                      )}
                    </Button>
                  </form>
                </Form>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Transfer Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-sm text-muted-foreground font-bold">
                  Available balance: {balance || "$0"}
                </div>
                <div className="text-sm font-medium">From</div>
                <div className="text-sm">{user?.id}</div>
              </div>

              <div>
                <div className="text-sm font-medium">To</div>
                <div className="text-sm">
                  {destinationAccountId || "Enter destination account ID"}
                </div>
              </div>

              <div>
                <div className="text-sm font-medium">Amount</div>
                <div className="text-2xl font-bold">
                  {form.watch("amount")
                    ? formatCurrency(form.watch("amount"))
                    : "$0.00"}
                </div>
              </div>

              {form.watch("description") && (
                <div>
                  <div className="text-sm font-medium">Description</div>
                  <div className="text-muted-foreground">
                    {form.watch("description")}
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <div className="text-xs text-muted-foreground">
                Transfers between accounts are processed immediately. External
                transfers may take 1-3 business days to complete.
              </div>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Transfers;
