import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";
import Invoice from "../InvoiceGenerator";
import { Download, Loader2, RefreshCw } from "lucide-react";
import { PDFDownloadLink } from "@react-pdf/renderer";
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

interface TransactionsDialogProps {
  userTransactions: Transaction[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  loading?: boolean;
}

export function TransactionsDialog({
  userTransactions,
  open,
  onOpenChange,
  loading
}: TransactionsDialogProps) {
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "PPpp");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* <DialogTrigger asChild>
        <Button variant="outline">View Transactions</Button>
      </DialogTrigger> */}
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Transaction History</DialogTitle>
        </DialogHeader>
        {/* {loading && (
          <div className="flex items-center justify-center">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Loading transactions...
          </div>
        )} */}
        <ScrollArea className="h-[500px] pr-4">
          {userTransactions.length > 0 && (

            <PDFDownloadLink
              document={<Invoice transactions={userTransactions} />}
              fileName="transactions_invoice.pdf"
              className="w-full" // Add proper styling
            >
              {({ loading }) => (
                <Button disabled={loading} className="w-full">
                  {loading ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Generating PDF...
                    </>
                  ) : (
                    <>
                      <Download className="mr-2 h-4 w-4" />
                      Download PDF
                    </>
                  )}
                </Button>
              )}
            </PDFDownloadLink>
          )}

          {loading ? (
            <div className="flex items-center justify-center">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Loading transactions...
            </div>
          ) : (

            <div className="space-y-4">
              {userTransactions.map((transaction) => (
                <div
                  key={transaction._id}
                  className="p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                >

                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">
                        From: {transaction.senderAccountId.userId.fullName}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {transaction.senderAccountId.userId.email}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        To: {transaction.receiverAccountId.userId.fullName}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {transaction.receiverAccountId.userId.email}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(transaction.createdAt)}
                      </p>
                    </div>
                    <div
                      className={`text-lg font-semibold ${transaction.amount >= 0
                        ? "text-green-600"
                        : "text-red-600"
                        }`}
                    >
                      {transaction.amount.toLocaleString(undefined, {
                        style: "currency",
                        currency: "USD",
                      })}
                    </div>
                  </div>
                </div>
              ))}
              {userTransactions.length === 0 && (
                <div className="text-center text-gray-500">No transactions</div>
              )}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}