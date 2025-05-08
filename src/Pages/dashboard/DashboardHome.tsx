import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import {
  Activity,
  ArrowUpRight,
  Wallet,
  ArrowDownLeft,
  UserPlus,
  TrendingUp,
  LineChart,
  Mail,
  CreditCard,
  BadgeCheck,
  Bell,
  Loader2,
  Calendar,
} from "lucide-react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import finteckApi from "@/axios/Axios";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import toast from "react-hot-toast";
import { Toaster } from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import { useUser } from "@/context/UserContextProvider";

const DashboardHome = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { fetchUser } = useUser();
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search);
  const success = query.get("success");

  const [balance, setBalance] = useState(0);
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [depositAmount, setDepositAmount] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const { accessToken, user, logout } = useUser();
  const [lastUpdated, setLastUpdated] = useState(null);

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { duration: 0.5 } },
  };

  const [balanceLoading, setBalanceLoading] = useState(true);
  const [subsLoading, setSubsLoading] = useState(true);

  const checkBalance = async () => {
    const userId = user?.id;
    console.log("ACCESS", accessToken);

    setBalanceLoading(true);
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
      setLastUpdated(response.data.lastUpdate);
      setBalance(response.data.balance);
      console.log("Your balance is:", response.data.balance);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch balance";
      toast.error(errorMessage);
      if (error.response?.status === 429) {
        logout();
      }
      console.error(error);
    } finally {
      setBalanceLoading(false);
    }
  };

  const getSubs = async () => {
    setSubsLoading(true);
    try {
      const response = await finteckApi.get("/stripe/subscription", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      console.log(response.data);
      setEndDate(response.data.nextBillingDate);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to get subscription";
      console.error("Error fetching subscription:", error);
      toast.error(errorMessage);
    } finally {
      setSubsLoading(false);
    }
  };

  useEffect(() => {
    if (accessToken) {
      // Execute both requests in parallel
      Promise.all([checkBalance(), getSubs()]).catch((error) => {
        console.error("Error in API calls:", error);
      });
    }
  }, [accessToken]);
  const [endDate, setEndDate] = useState(null);
  const deposit = async () => {
    const userId = user?.id;
    const amount = parseFloat(depositAmount);

    if (isNaN(amount)) {
      alert("Please enter a valid amount");
      return;
    }

    setIsProcessing(true);
    try {
      const response = await finteckApi.post(
        "/account/deposit",
        { userId, amount },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      console.log("Deposit successful:", response.data);
      checkBalance();
      setIsDepositModalOpen(false);
      toast.success(response.data.message);
      setDepositAmount("");
    } catch (error: any) {
      const e = error.response.data;
      console.log(e.message);

      toast.error(e.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <Toaster position="top-center" />
      {/* Deposit Modal */}
      <Dialog open={isDepositModalOpen} onOpenChange={setIsDepositModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Deposit Money</DialogTitle>
            <DialogDescription>
              Enter the amount you want to deposit to your account.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="amount" className="text-right">
                Amount ($)
              </Label>
              <Input
                id="amount"
                type="number"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                className="col-span-3"
                placeholder="0.00"
                disabled={isProcessing}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setIsDepositModalOpen(false);
                setDepositAmount("");
              }}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button onClick={deposit} disabled={isProcessing || !depositAmount}>
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Deposit"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Transaction Hub</h1>
          <p className="text-muted-foreground mt-1">
            Your financial activity looks strong today.
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <motion.div
        className="grid grid-cols-1 gap-6 mb-8"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {/* Centered Balance Card */}
        <motion.div
          variants={item}
          className="flex flex-col gap-2 max-w-md mx-auto w-full"
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Available Funds
              </CardTitle>
              <Wallet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {balanceLoading ? (
                <>
                  <div className="h-8 w-24 bg-gray-200 rounded-md animate-pulse mb-2"></div>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground mt-1">
                    <div className="flex items-center">
                      <div className="h-4 w-4 bg-gray-200 rounded-full animate-pulse mr-1"></div>
                      <div className="h-4 w-24 bg-gray-200 rounded-md animate-pulse"></div>
                    </div>
                    <div className="h-4 w-32 bg-gray-200 rounded-md animate-pulse"></div>
                  </div>
                </>
              ) : (
                <>
                  <div className="text-2xl font-bold">${balance}</div>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground mt-1">
                    <span className="flex items-center text-emerald-500">
                      <ArrowUpRight className="h-4 w-4 mr-1" />
                      Last Updated:
                    </span>
                    <span>
                      {" "}
                      {lastUpdated
                        ? new Date(lastUpdated).toLocaleString()
                        : "N/A"}
                    </span>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
          <Button
            className="bg-blue-500 hover:bg-blue-600"
            onClick={() => setIsDepositModalOpen(true)}
          >
            Deposit Money
          </Button>
        </motion.div>

        <motion.div variants={item}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Your Account
              </CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {subsLoading ? (
                <>
                  <div className="h-8 w-32 bg-gray-200 rounded-md animate-pulse mb-4"></div>
                  <div className="flex flex-col space-y-3 mt-2">
                    <div className="flex items-center space-x-2">
                      <div className="h-4 w-4 bg-gray-200 rounded-full animate-pulse mr-1"></div>
                      <div className="h-4 w-48 bg-gray-200 rounded-md animate-pulse"></div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="h-4 w-4 bg-gray-200 rounded-full animate-pulse mr-1"></div>
                      <div className="h-4 w-16 bg-gray-200 rounded-md animate-pulse"></div>
                      <div className="h-4 w-20 bg-gray-200 rounded-md animate-pulse"></div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="h-4 w-4 bg-gray-200 rounded-full animate-pulse mr-1"></div>
                      <div className="h-4 w-56 bg-gray-200 rounded-md animate-pulse"></div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="h-4 w-4 bg-gray-200 rounded-full animate-pulse mr-1"></div>
                      <div className="h-4 w-40 bg-gray-200 rounded-md animate-pulse"></div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="text-2xl font-bold">{user?.fullName}</div>
                  <div className="flex flex-col space-y-3 mt-2">
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Mail className="h-4 w-4 mr-1" />
                      <span>{user?.email}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <BadgeCheck className="h-4 w-4 mr-1" />
                      <span>Status: </span>
                      <span
                        className={
                          user?.isSubscribed
                            ? "text-emerald-500"
                            : "text-amber-500"
                        }
                      >
                        {user?.isSubscribed ? "Active" : "Not active"}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4 mr-1" />
                      Expires:{" "}
                      {endDate ? new Date(endDate).toDateString() : "N/A"}
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <CreditCard className="h-4 w-4 mr-1" />
                      <span>Account: {user?.id}</span>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default DashboardHome;
