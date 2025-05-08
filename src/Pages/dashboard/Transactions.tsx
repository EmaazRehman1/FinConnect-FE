import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";

import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  ArrowUpRight,
  ScrollText,
  Search,
  ChevronLeft,
  ChevronRight,
  Filter,
  Download,
  X,
  RefreshCw,
  User,
} from "lucide-react";

import { useUser } from "@/context/UserContextProvider";
import finteckApi from "@/axios/Axios";
import toast from "react-hot-toast";
// Interface to match the received transaction format
interface User {
  _id: string;
  fullName: string;
  email: string;
  role: string;
}

interface Account {
  _id: string;
  userId: User;
  balance: number;
  cnic: string | null;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface Transaction {
  _id: string;
  senderAccountId: Account;
  receiverAccountId: Account;
  amount: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface ApiResponse {
  data: Transaction[];
  totalCount: number;
}

const Transactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalTransactions, setTotalTransactions] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);
  const [showAllTransactions, setShowAllTransactions] = useState(true);
  const { accessToken, user, logout } = useUser();

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const didRunOnce = useRef(false);

  useEffect(() => {
    // Skip the very first duplicate caused by React.StrictMode
    if (!didRunOnce.current) {
      didRunOnce.current = true;
      return;
    }

    fetchTransactions();
  }, [currentPage, pageSize, searchTerm, showAllTransactions, accessToken]);

  const fetchTransactions = async () => {
    setIsLoading(true);

    try {
      // Prepare params object for axios
      const params: Record<string, string | number> = {};

      // Add pagination parameters based on mode
      if (!showAllTransactions) {
        // For paginated view, use the currentPage directly
        params.page = currentPage;
        params.page_size = pageSize;
      } else {
        // For "show all" view, we want page 1 with large limit
        params.page = 1;
        params.page_size = 1000; // Use large number to get all
      }

      console.log("Fetching transactions with params:", params);

      // Make the API call using finteckApi with the correct parameters
      const response = await finteckApi.get("/account/transaction", {
        params,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      console.log("API response:", response.data);
      const totalPages = Math.ceil(totalTransactions / pageSize);
      console.log(totalTransactions);
      // Access the data from the response
      let transactions: Transaction[];
      let totalCount: number;

      // Handle different potential response formats
      if (Array.isArray(response.data)) {
        transactions = response.data;
        totalCount = response.data.length;
      } else if (response.data.data && Array.isArray(response.data.data)) {
        transactions = response.data.data;
        totalCount = response.data.totalCount || transactions.length;
      } else {
        throw new Error("Unexpected response format");
      }

      setTransactions(transactions);
      if (showAllTransactions) {
        setTotalTransactions(totalCount);
      }
    } catch (error: any) {
      toast.error(error.response.data.message);
      if (error.response.status === 429) {
        logout();
      }
      console.error("Error fetching transactions:", error);
      setTransactions([]);
      setTotalTransactions(0);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle page change
  const handlePageChange = (newPage: number) => {
    // if (newPage < 1 || newPage > totalPages || newPage === currentPage) return;
    // if(newPage<1 || newPage > totalPages ) return
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
    fetchTransactions();
  };

  // Refresh transactions
  const refreshTransactions = () => {
    fetchTransactions();
  };

  // Toggle between showing all transactions and paginated results
  const toggleTransactionView = () => {
    setShowAllTransactions(!showAllTransactions);
    setCurrentPage(1); // Reset to first page when toggling
  };

  const totalPages = Math.max(1, Math.ceil(totalTransactions / pageSize));

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    if (isMobileView) {
      return date.toLocaleDateString();
    }
    return (
      date.toLocaleDateString() +
      " " +
      date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    );
  };

  console.log("user tr", user);
  console.log(transactions);

  const renderDesktopTable = () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[180px]">Date</TableHead>
          <TableHead>From</TableHead>
          <TableHead>To</TableHead>
          <TableHead className="text-right">Amount</TableHead>
          <TableHead className="text-right">Transaction Type</TableHead>
          <TableHead className="text-center">Transaction ID</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading ? (
          [...Array(pageSize)].map((_, i) => (
            <TableRow key={i} className="animate-pulse">
              <TableCell>
                <div className="h-5 bg-muted rounded w-24"></div>
              </TableCell>
              <TableCell>
                <div className="h-5 bg-muted rounded w-36"></div>
              </TableCell>
              <TableCell>
                <div className="h-5 bg-muted rounded w-36"></div>
              </TableCell>
              <TableCell>
                <div className="h-5 bg-muted rounded w-24 ml-auto"></div>
              </TableCell>
              <TableCell>
                <div className="h-5 bg-muted rounded w-24 ml-auto"></div>
              </TableCell>
              <TableCell>
                <div className="h-5 bg-muted rounded w-20 mx-auto"></div>
              </TableCell>
            </TableRow>
          ))
        ) : transactions.length > 0 ? (
          transactions.map((transaction) => (
            <TableRow key={transaction._id}>
              <TableCell className="font-medium">
                {formatDate(transaction.createdAt)}
              </TableCell>
              <TableCell>
                <div className="flex items-center">
                  <User className="h-4 w-4 text-gray-500 mr-2" />
                  {transaction.senderAccountId.userId.fullName}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center">
                  <User className="h-4 w-4 text-gray-500 mr-2" />
                  {transaction.receiverAccountId.userId.fullName}
                </div>
              </TableCell>
              <TableCell className="text-right font-medium text-green-500">
                {formatCurrency(transaction.amount)}
              </TableCell>
              <TableCell className="text-center text-xs text-muted-foreground">
                <div>
                  {user?.id === String(transaction.senderAccountId.userId._id)
                    ? "Sent"
                    : "Received"}
                </div>
              </TableCell>
              <TableCell className="text-center text-xs text-muted-foreground">
                {transaction._id.substring(0, 8)}...
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell
              colSpan={5}
              className="text-center py-8 text-muted-foreground"
            >
              No transactions found
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );

  const renderMobileCards = () => (
    <div className="space-y-4">
      {isLoading ? (
        [...Array(pageSize)].map((_, i) => (
          <div key={i} className="border rounded p-4 animate-pulse">
            <div className="h-5 bg-muted rounded w-24 mb-3"></div>
            <div className="h-5 bg-muted rounded w-full mb-3"></div>
            <div className="flex justify-between">
              <div className="h-5 bg-muted rounded w-20"></div>
              <div className="h-5 bg-muted rounded w-24"></div>
            </div>
          </div>
        ))
      ) : transactions.length > 0 ? (
        transactions.map((transaction) => (
          <div key={transaction._id} className="border rounded p-4">
            <div className="flex justify-between items-start mb-2">
              <div className="font-medium">
                {formatDate(transaction.createdAt)}
              </div>
              <div className="text-xs text-muted-foreground">
                ID: {transaction._id.substring(0, 8)}...
              </div>
            </div>
            <div className="mb-3">
              <div className="flex items-center text-sm mb-1">
                <span className="text-muted-foreground mr-2">From:</span>
                <User className="h-4 w-4 text-gray-500 mr-1" />
                <span>{transaction.senderAccountId.userId.fullName}</span>
              </div>
              <div className="flex items-center text-sm">
                <span className="text-muted-foreground mr-2">To:</span>
                <User className="h-4 w-4 text-gray-500 mr-1" />
                <span>{transaction.receiverAccountId.userId.fullName}</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center text-sm">
                <ArrowUpRight className="h-4 w-4 text-blue-500 mr-1" />
                <span>Transfer</span>
              </div>
              <div className="font-medium text-green-500">
                {formatCurrency(transaction.amount)}
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="border rounded p-6 text-center text-muted-foreground">
          No transactions found
        </div>
      )}
    </div>
  );

  return (
    <div className="container mx-auto px-2 sm:px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
          Transaction History
        </h1>

        <Card>
          <CardHeader className="pb-0">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-2 sm:gap-4">
              <div className="flex justify-between items-center w-full">
                <CardTitle className="text-lg sm:text-xl">
                  Transactions
                </CardTitle>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size={isMobileView ? "sm" : "default"}
                    onClick={refreshTransactions}
                    className="ml-auto"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                  </Button>

                  <Button
                    variant="outline"
                    size={isMobileView ? "sm" : "default"}
                    onClick={toggleTransactionView}
                  >
                    {showAllTransactions ? "Show Paginated" : "Show All"}
                  </Button>

                  {/* <Button
                    variant="outline"
                    size={isMobileView ? "sm" : "default"}
                    onClick={() => setShowFilters(!showFilters)}
                  >
                    <Filter className="h-4 w-4 mr-2" />
                    {showFilters ? 'Hide Filters' : 'Show Filters'}
                  </Button> */}
                </div>
              </div>
            </div>

            {/* {renderFilters()} */}
          </CardHeader>

          <CardContent className="pt-4 sm:pt-6 px-2 sm:px-6">
            <div className="rounded-md border overflow-hidden">
              {isMobileView ? renderMobileCards() : renderDesktopTable()}
            </div>
          </CardContent>

          <CardFooter className="flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-4 px-2 sm:px-6 py-3 sm:py-4">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs sm:text-sm text-muted-foreground truncate">
                {transactions.length > 0 ? (
                  showAllTransactions ? (
                    <>Showing all {totalTransactions} transactions</>
                  ) : (
                    <>
                      Showing {(currentPage - 1) * pageSize + 1} to{" "}
                      {Math.min(currentPage * pageSize, totalTransactions)} of{" "}
                      {totalTransactions}
                    </>
                  )
                ) : (
                  <>0 transactions</>
                )}
              </span>

              {!showAllTransactions && (
                <>
                  <Select
                    value={pageSize.toString()}
                    onValueChange={(value) => {
                      setPageSize(Number(value));
                      setCurrentPage(1);
                    }}
                  >
                    <SelectTrigger className="w-[70px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5</SelectItem>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="20">20</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                    </SelectContent>
                  </Select>

                  <span className="text-xs sm:text-sm text-muted-foreground">
                    per page
                  </span>
                </>
              )}
            </div>

            <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto">
              {!showAllTransactions && (
                <div className="flex items-center">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handlePageChange(currentPage - 1)}
                    // disabled={currentPage === 1 || isLoading}
                    className="h-8 w-8"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>

                  <div className="mx-2 sm:mx-4 text-xs sm:text-sm">
                    Page {currentPage} of {totalPages}
                  </div>

                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handlePageChange(currentPage + 1)}
                    // disabled={currentPage === totalPages || totalPages === 0 || isLoading}
                    className="h-8 w-8"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}

              {/* <Button
                variant="outline"
                className="ml-2 sm:ml-4 text-xs sm:text-sm px-2 sm:px-3 py-1"
                disabled={isLoading || transactions.length === 0}
              >
                <Download className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Export</span>
              </Button> */}
            </div>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default Transactions;
