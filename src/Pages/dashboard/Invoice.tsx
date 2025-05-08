import { useState } from "react";
import { motion } from "framer-motion";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
  CardDescription,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  FileText,
  Download,
  RefreshCw,
  Clock,
  AlertCircle,
  CheckCircle,
  Calendar as CalendarIcon,
  ChevronDown,
  Eye,
} from "lucide-react";
import finteckApi from "@/axios/Axios";
import { useUser } from "@/context/UserContextProvider";
import Invoice from "@/components/InvoiceGenerator";
import { PDFDownloadLink } from "@react-pdf/renderer";
import toast, { Toaster } from "react-hot-toast";
// Form schema
const invoiceSchema = z
  .object({
    startDate: z.date({
      required_error: "Start date is required",
    }),
    endDate: z.date({
      required_error: "End date is required",
    }),
  })
  .refine((data) => data.endDate >= data.startDate, {
    message: "End date must be after start date",
    path: ["endDate"],
  });

// Mock invoice data
const mockInvoices = [
  {
    id: "INV-2023-001",
    period: "Jan 1, 2023 - Jan 31, 2023",
    created: "Feb 1, 2023",
    amount: 56.99,
    status: "paid",
    transactions: 28,
  },
  {
    id: "INV-2023-002",
    period: "Feb 1, 2023 - Feb 28, 2023",
    created: "Mar 1, 2023",
    amount: 49.99,
    status: "paid",
    transactions: 23,
  },
  {
    id: "INV-2023-003",
    period: "Mar 1, 2023 - Mar 31, 2023",
    created: "Apr 1, 2023",
    amount: 62.5,
    status: "paid",
    transactions: 32,
  },
  {
    id: "INV-2023-004",
    period: "Apr 1, 2023 - Apr 30, 2023",
    created: "May 1, 2023",
    amount: 55.25,
    status: "pending",
    transactions: 26,
  },
];

const Invoices = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generatedInvoice, setGeneratedInvoice] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("generate");
  // const [invoiceData, setInvoiceData] = useState(null)
  const [invoiceData, setInvoiceData] = useState<null>(null);
  const [viewingInvoice, setViewingInvoice] = useState<any | null>(null);
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" && window.innerWidth < 768
  );
  const { accessToken, user, logout } = useUser();
  // Effect to handle window resizing for responsive behavior
  useState(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    if (typeof window !== "undefined") {
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  });

  // Form setup
  const form = useForm<z.infer<typeof invoiceSchema>>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      startDate: undefined,
      endDate: undefined,
    },
  });

  const onSubmit = async (data: z.infer<typeof invoiceSchema>) => {
    setIsSubmitting(true);
    setError(null);
    setGeneratedInvoice(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      if (!data.startDate || !data.endDate) {
        console.log("Start and end dates are required");
      }

      const start = new Date(data.startDate);
      const end = new Date(data.endDate);

      const query = new URLSearchParams({
        startDate: start.toISOString().slice(0, 10), // YYYY-MM-DD
        endDate: end.toISOString().slice(0, 10),
      }).toString();
      const response = await finteckApi.get(`/invoice/get-invoice/?${query}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      console.log("invpice", response);
      setInvoiceData(response.data);
      setGeneratedInvoice(response.data);
    } catch (error: any) {
      toast.error(error.response.data.message);

      if (error.response.status === 429) {
        logout();
      }
      setError(error.response.data.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-500">
            <CheckCircle className="w-3 h-3 mr-1" />
            Paid
          </span>
        );
      case "pending":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-800/20 dark:text-yellow-500">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </span>
        );
      case "generated":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-800/20 dark:text-blue-500">
            <FileText className="w-3 h-3 mr-1" />
            Generated
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800/20 dark:text-gray-500">
            {status}
          </span>
        );
    }
  };

  // Mobile invoice detail view component
  const InvoiceDetailView = ({ invoice, onClose }: any) => (
    <Card className="mb-4">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Invoice Detail</CardTitle>
        <Button variant="ghost" size="sm" onClick={onClose}>
          ✕
        </Button>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="font-medium">Invoice ID:</span>
          <span>{invoice.id}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="font-medium">Period:</span>
          <span>{invoice.period}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="font-medium">Created:</span>
          <span>{invoice.created}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="font-medium">Transactions:</span>
          <span>{invoice.transactions}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="font-medium">Amount:</span>
          <span className="font-semibold">
            {formatCurrency(invoice.amount)}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="font-medium">Status:</span>
          {getStatusBadge(invoice.status)}
        </div>
      </CardContent>
    </Card>
  );

  // Custom DatePicker component
  const DatePicker = ({ date, setDate, placeholder }: any) => (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-full flex justify-between items-center text-left font-normal"
        >
          {date ? (
            format(date, "PPP")
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
          <CalendarIcon className="ml-2 h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );

  // Mobile card view for invoices
  const renderMobileInvoiceCard = (invoice: any) => (
    <Card key={invoice.id} className="mb-3">
      <CardContent className="pt-4">
        <div className="flex justify-between items-start mb-2">
          <span className="font-medium text-sm">{invoice.id}</span>
          {getStatusBadge(invoice.status)}
        </div>
        <div className="text-xs text-muted-foreground mb-2">
          {invoice.period}
        </div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm">Transactions: {invoice.transactions}</span>
          <span className="font-medium">{formatCurrency(invoice.amount)}</span>
        </div>
        <div className="flex justify-between mt-3">
          <Button
            variant="outline"
            size="sm"
            className="text-xs"
            onClick={() => setViewingInvoice(invoice)}
          >
            <Eye className="h-3 w-3 mr-1" />
            View
          </Button>
          <Button variant="outline" size="sm" className="text-xs">
            <Download className="h-3 w-3 mr-1" />
            PDF
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto px-4">
      <Toaster />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-xl sm:text-2xl font-bold">Invoices</h1>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 mb-4 sm:mb-8">
            {/* <TabsTrigger value="generate" className="flex items-center">
              <FileText className="w-4 h-4 mr-2 hidden sm:inline" />
              Generate Invoice
            </TabsTrigger> */}
            {/* <TabsTrigger value="history" className="flex items-center">
              <Clock className="w-4 h-4 mr-2 hidden sm:inline" />
              Invoice History
            </TabsTrigger> */}
          </TabsList>

          <TabsContent value="generate">
            {/* Mobile invoice detail view (if active) */}
            {isMobile && viewingInvoice && (
              <InvoiceDetailView
                invoice={viewingInvoice}
                onClose={() => setViewingInvoice(null)}
              />
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg sm:text-xl">
                      Generate Period Invoice
                    </CardTitle>
                    <CardDescription className="text-sm">
                      Select a date range to generate an invoice for all
                      transactions in that period.
                    </CardDescription>
                  </CardHeader>

                  <CardContent>
                    {error && (
                      <Alert variant="destructive" className="mb-4 sm:mb-6">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}

                    {generatedInvoice ? (
                      <Alert className="bg-green-500/10 text-green-500 border-green-500/20">
                        <CheckCircle className="h-4 w-4" />
                        <AlertTitle>Invoice Generated Successfully</AlertTitle>
                        <AlertDescription className="space-y-2">
                          <p>Your invoice has been generated</p>

                          {invoiceData ? (
                            <PDFDownloadLink
                              document={<Invoice transactions={invoiceData} />}
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
                          ) : (
                            <Button variant="outline" disabled>
                              No data available
                            </Button>
                          )}
                        </AlertDescription>
                      </Alert>
                    ) : (
                      <Form {...form}>
                        <form
                          onSubmit={form.handleSubmit(onSubmit)}
                          className="space-y-4 sm:space-y-6"
                        >
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                            <FormField
                              control={form.control}
                              name="startDate"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Start Date</FormLabel>
                                  <FormControl>
                                    <DatePicker
                                      date={field.value}
                                      setDate={field.onChange}
                                      placeholder="Select start date"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="endDate"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>End Date</FormLabel>
                                  <FormControl>
                                    <DatePicker
                                      date={field.value}
                                      setDate={field.onChange}
                                      placeholder="Select end date"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          <Button
                            type="submit"
                            className="w-full bg-blue-500 hover:bg-blue-600"
                            disabled={isSubmitting}
                          >
                            {isSubmitting ? (
                              <>
                                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                                Generating...
                              </>
                            ) : (
                              "Generate Invoice"
                            )}
                          </Button>
                        </form>
                      </Form>
                    )}
                  </CardContent>
                </Card>
              </div>

              <div className="hidden sm:block">
                <Card>
                  <CardHeader>
                    <CardTitle>Invoice Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 text-sm">
                    <p>
                      Invoices summarize all transactions within the specified
                      date range, including transaction counts and total
                      amounts.
                    </p>

                    <div className="space-y-2">
                      <h4 className="font-medium">What's included:</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Transaction summary</li>
                        <li>Count of transactions by type</li>
                        <li>Total amount processed</li>
                        <li>Itemized list of transactions</li>
                        <li>Invoice reference number</li>
                      </ul>
                    </div>

                    <div className="border-t pt-4">
                      <p className="text-muted-foreground">
                        Invoices are generated as downloadable PDF documents and
                        are also stored in your account history for future
                        reference.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="history">
            {/* Mobile invoice detail view (if active) */}
            {isMobile && viewingInvoice && (
              <InvoiceDetailView
                invoice={viewingInvoice}
                onClose={() => setViewingInvoice(null)}
              />
            )}

            <Card>
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">
                  Invoice History
                </CardTitle>
                <CardDescription className="text-sm">
                  View and download your previously generated invoices.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Mobile card view for small screens */}
                {isMobile ? (
                  <div className="space-y-2">
                    {/* Show the generated invoice first if it exists */}
                    {generatedInvoice &&
                      renderMobileInvoiceCard(generatedInvoice)}

                    {/* Then show the mock invoices */}
                    {mockInvoices.map((invoice) =>
                      renderMobileInvoiceCard(invoice)
                    )}
                  </div>
                ) : (
                  /* Desktop table view for larger screens */
                  <div className="rounded-md border overflow-hidden overflow-x-auto">
                    <table className="min-w-full divide-y divide-border">
                      <thead className="bg-muted/50">
                        <tr>
                          <th
                            scope="col"
                            className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
                          >
                            Invoice ID
                          </th>
                          <th
                            scope="col"
                            className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
                          >
                            Period
                          </th>
                          <th
                            scope="col"
                            className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
                          >
                            Created
                          </th>
                          <th
                            scope="col"
                            className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
                          >
                            Transactions
                          </th>
                          <th
                            scope="col"
                            className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
                          >
                            Amount
                          </th>
                          <th
                            scope="col"
                            className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
                          >
                            Status
                          </th>
                          <th
                            scope="col"
                            className="px-4 sm:px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider"
                          >
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-card divide-y divide-border">
                        {/* Show the generated invoice first if it exists */}
                        {generatedInvoice && (
                          <tr>
                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
                              {generatedInvoice.id}
                            </td>
                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm">
                              {generatedInvoice.period}
                            </td>
                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm">
                              {generatedInvoice.created}
                            </td>
                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm">
                              {generatedInvoice.transactions}
                            </td>
                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
                              {formatCurrency(generatedInvoice.amount)}
                            </td>
                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                              {getStatusBadge(generatedInvoice.status)}
                            </td>
                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-right text-sm">
                              <Button
                                variant="outline"
                                size="sm"
                                className="flex items-center"
                              >
                                <Download className="w-4 h-4 mr-1" />
                                PDF
                              </Button>
                            </td>
                          </tr>
                        )}

                        {/* Then show the mock invoices */}
                        {mockInvoices.map((invoice) => (
                          <tr key={invoice.id}>
                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
                              {invoice.id}
                            </td>
                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm">
                              {invoice.period}
                            </td>
                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm">
                              {invoice.created}
                            </td>
                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm">
                              {invoice.transactions}
                            </td>
                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
                              {formatCurrency(invoice.amount)}
                            </td>
                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                              {getStatusBadge(invoice.status)}
                            </td>
                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-right text-sm">
                              <Button
                                variant="outline"
                                size="sm"
                                className="flex items-center"
                              >
                                <Download className="w-4 h-4 mr-1" />
                                PDF
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Invoices are stored for up to 7 years in accordance with
                  financial regulations.
                </p>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};

export default Invoices;
