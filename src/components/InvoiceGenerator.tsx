// import React from 'react';
// import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

// // Define TypeScript interfaces
// interface User {
//   _id: string;
//   fullName: string;
//   email: string;
//   role: string;
// }

// interface Account {
//   _id: string;
//   userId: User;
//   balance: number;
//   cnic: string | null;
//   createdAt: string;
//   updatedAt: string;
//   __v: number;
// }

// interface Transaction {
//   _id: string;
//   senderAccountId: Account;
//   receiverAccountId: Account;
//   amount: number;
//   createdAt: string;
//   updatedAt: string;
//   __v: number;
// }

// interface InvoiceProps {
//   transactions: Transaction[];
// }

// // Create styles
// const styles = StyleSheet.create({
//   page: {
//     padding: 30,
//     fontFamily: 'Helvetica',
//   },
//   header: {
//     marginBottom: 20,
//     paddingBottom: 10,
//     borderBottom: '1px solid #000',
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 5,
//   },
//   subtitle: {
//     fontSize: 12,
//     color: '#666',
//   },
//   table: {
//     width: '100%',
//     borderStyle: 'solid',
//     borderWidth: 1,
//     borderColor: '#bfbfbf',
//     marginBottom: 20,
//   },
//   tableRow: {
//     flexDirection: 'row',
//   },
//   tableColHeader: {
//     width: '20%',
//     borderStyle: 'solid',
//     borderWidth: 1,
//     borderColor: '#bfbfbf',
//     backgroundColor: '#f0f0f0',
//     padding: 5,
//   },
//   tableCol: {
//     width: '20%',
//     borderStyle: 'solid',
//     borderWidth: 1,
//     borderColor: '#bfbfbf',
//     padding: 5,
//   },
//   headerText: {
//     fontSize: 10,
//     fontWeight: 'bold',
//   },
//   bodyText: {
//     fontSize: 9,
//   },
//   summarySection: {
//     marginTop: 20,
//     paddingTop: 10,
//     borderTop: '1px solid #000',
//   },
//   summaryRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 5,
//   },
//   summaryLabel: {
//     fontWeight: 'bold',
//     fontSize: 10,
//   },
//   summaryValue: {
//     fontSize: 10,
//   },
//   grandTotal: {
//     marginTop: 10,
//     paddingTop: 10,
//     borderTop: '1px solid #000',
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
//   grandTotalLabel: {
//     fontWeight: 'bold',
//     fontSize: 12,
//   },
//   grandTotalValue: {
//     fontWeight: 'bold',
//     fontSize: 12,
//   },
// });

// const Invoice: React.FC<InvoiceProps> = ({ transactions = [] }) => {
//   const grandTotal = transactions.reduce((sum, txn) => sum + txn.amount, 0);
//   const date = new Date().toLocaleDateString();
//   // Calculate summary by sender
//   const senderSummary: Record<string, { name: string; total: number }> = {};
//   transactions.forEach(txn => {
//     const senderId = txn.senderAccountId.userId._id;
//     if (!senderSummary[senderId]) {
//       senderSummary[senderId] = {
//         name: txn.senderAccountId.userId.fullName,
//         total: 0
//       };
//     }
//     senderSummary[senderId].total += txn.amount;
//   });

//   return (
//     <Document>
//       <Page size="A4" style={styles.page}>
//         <View style={styles.header}>
//           <Text style={styles.title}>Transaction Invoice</Text>
//           <Text style={styles.subtitle}>Generated on: {date}</Text>
//           <Text style={styles.subtitle}>Total Transactions: {transactions.length}</Text>
//         </View>

//         {/* Transactions Table */}
//         <View style={styles.table}>
//           {/* Table Header */}
//           <View style={styles.tableRow} >
//             <View style={styles.tableColHeader}>
//               <Text style={styles.headerText}>Date & Time</Text>
//             </View>
//             <View style={styles.tableColHeader}>
//               <Text style={styles.headerText}>Sender</Text>
//             </View>
//             <View style={styles.tableColHeader}>
//               <Text style={styles.headerText}>Receiver</Text>
//             </View>
//             <View style={styles.tableColHeader}>
//               <Text style={styles.headerText}>Amount</Text>
//             </View>
//             <View style={styles.tableColHeader}>
//               <Text style={styles.headerText}>Status</Text>
//             </View>
//           </View>
          
//           {/* Table Body */}
//           {transactions.map(txn => (
//             <View key={txn._id} style={styles.tableRow}>
//               <View style={styles.tableCol}>
//                 <Text style={styles.bodyText}>
//                   {new Date(txn.createdAt).toLocaleString()}
//                 </Text>
//               </View>
//               <View style={styles.tableCol}>
//                 <Text style={styles.bodyText}>
//                   {txn.senderAccountId.userId.fullName}
//                 </Text>
//                 <Text style={[styles.bodyText, { fontSize: 8, color: '#666' }]}>
//                   {txn.senderAccountId.userId.email}
//                 </Text>
//               </View>
//               <View style={styles.tableCol}>
//                 <Text style={styles.bodyText}>
//                   {txn.receiverAccountId.userId.fullName}
//                 </Text>
//                 <Text style={[styles.bodyText, { fontSize: 8, color: '#666' }]}>
//                   {txn.receiverAccountId.userId.email}
//                 </Text>
//               </View>
//               <View style={styles.tableCol}>
//                 <Text style={styles.bodyText}>
//                   ${txn.amount.toFixed(2)}
//                 </Text>
//               </View>
//               <View style={styles.tableCol}>
//                 <Text style={styles.bodyText}>Completed</Text>
//               </View>
//             </View>
//           ))}
//         </View>

//         {/* Summary Section */}
//         {/* <View style={styles.summarySection}>
//           <Text style={{ fontSize: 12, fontWeight: 'bold', marginBottom: 10 }}>Summary by Sender:</Text>
//           {Object.entries(senderSummary).map(([senderId, summary]) => (
//             <View key={senderId} style={styles.summaryRow}>
//               <Text style={styles.summaryLabel}>{summary.name}:</Text>
//               <Text style={styles.summaryValue}>${summary.total.toFixed(2)}</Text>
//             </View>
//           ))}
//         </View> */}

//         {/* Grand Total */}
//         {/* <View style={styles.grandTotal}>
//           <Text style={styles.grandTotalLabel}>Grand Total:</Text>
//           <Text style={styles.grandTotalValue}>${grandTotal.toFixed(2)}</Text>
//         </View> */}
//       </Page>
//     </Document>
//   );
// };

// export default Invoice;
import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';

// Define TypeScript interfaces
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

interface InvoiceProps {
  transactions: Transaction[];
  companyInfo?: {
    name: string;
    address: string;
    phone: string;
    email: string;
    website: string;
    logo?: string;
  };
  invoiceInfo?: {
    number: string;
    date: string;
    dueDate: string;
  };
}

// Create styles
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    fontSize: 12,
    lineHeight: 1.5,
    color: '#333',
  },
  section: {
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  logo: {
    width: 120,
    height: 50,
    marginBottom: 10,
  },
  companyInfo: {
    fontSize: 10,
    color: '#666',
    textAlign: 'right',
  },
  documentTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#2c5282',
  },
  infoSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  infoColumn: {
    width: '48%',
  },
  infoBlock: {
    marginBottom: 15,
  },
  infoBlockTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#2c5282',
    borderBottom: '1px solid #e2e8f0',
    paddingBottom: 3,
  },
  infoText: {
    fontSize: 10,
    marginBottom: 3,
  },
  table: {
    width: '100%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 30,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f7fafc',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    minHeight: 30,
    paddingVertical: 8,
    paddingHorizontal: 5,
    alignItems: 'center',
  },
  lastRow: {
    borderBottomWidth: 0,
  },
  dateCol: {
    width: '20%',
  },
  senderCol: {
    width: '25%',
  },
  receiverCol: {
    width: '25%',
  },
  amountCol: {
    width: '15%',
    textAlign: 'right',
  },
  statusCol: {
    width: '15%',
    textAlign: 'center',
  },
  headerText: {
    fontSize: 10,
    fontWeight: 'bold',
    padding: 8,
  },
  bodyText: {
    fontSize: 9,
  },
  emailText: {
    fontSize: 8,
    color: '#666',
    marginTop: 2,
  },
  summarySection: {
    marginTop: 30,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingTop: 10,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 5,
  },
  summaryLabel: {
    width: '20%',
    textAlign: 'right',
    paddingRight: 10,
    fontWeight: 'bold',
  },
  summaryValue: {
    width: '15%',
    textAlign: 'right',
  },
  grandTotal: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#2c5282',
  },
  grandTotalText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2c5282',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingTop: 10,
    fontSize: 8,
    color: '#666',
    textAlign: 'center',
  },
  thankYou: {
    marginTop: 50,
    fontSize: 12,
    textAlign: 'center',
    fontStyle: 'italic',
    color: '#2c5282',
  },
});

const Invoice: React.FC<InvoiceProps> = ({ 
  transactions = [],
  companyInfo = {
    name: "Financial Services, Inc.",
    address: "123 Finance Street, New York, NY 10001",
    phone: "+1 (555) 123-4567",
    email: "info@financialservices.com",
    website: "www.financialservices.com"
  },
  invoiceInfo = {
    number: `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
    date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
    dueDate: new Date(Date.now() + 30*24*60*60*1000).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  }
}) => {
  const grandTotal = transactions.reduce((sum, txn) => sum + txn.amount, 0);
  
  // Calculate summary by sender
  const senderSummary: Record<string, { name: string; total: number }> = {};
  transactions.forEach(txn => {
    const senderId = txn.senderAccountId.userId._id;
    if (!senderSummary[senderId]) {
      senderSummary[senderId] = {
        name: txn.senderAccountId.userId.fullName,
        total: 0
      };
    }
    senderSummary[senderId].total += txn.amount;
  });

  // Format dates nicely
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header Section with Logo and Company Info */}

        {/* Invoice Title */}
        <View style={styles.section}>
          <Text style={styles.documentTitle}>TRANSACTION INVOICE</Text>
        </View>

        {/* Invoice and Client Info Section */}
        <View style={styles.infoSection}>
          {/* Invoice Details */}
          <View style={styles.infoColumn}>
            <View style={styles.infoBlock}>
              <Text style={styles.infoBlockTitle}>INVOICE DETAILS</Text>
              <Text style={styles.infoText}>Invoice Number: {invoiceInfo.number}</Text>
              <Text style={styles.infoText}>Issue Date: {invoiceInfo.date}</Text>
              <Text style={styles.infoText}>Total Transactions: {transactions.length}</Text>
            </View>
          </View>
          
          {/* Payment Details */}
          <View style={styles.infoColumn}>
            <View style={styles.infoBlock}>
              <Text style={styles.infoBlockTitle}>PAYMENT INFORMATION</Text>
              <Text style={styles.infoText}>Total Amount: ${grandTotal.toFixed(2)}</Text>
              <Text style={styles.infoText}>Payment Status: Completed</Text>
            </View>
          </View>
        </View>

        {/* Transactions Table */}
        <View style={styles.section}>
          <Text style={styles.infoBlockTitle}>TRANSACTION DETAILS</Text>
          <View style={styles.table}>
            {/* Table Header */}
            <View style={styles.tableHeader}>
              <View style={styles.dateCol}>
                <Text style={styles.headerText}>DATE & TIME</Text>
              </View>
              <View style={styles.senderCol}>
                <Text style={styles.headerText}>SENDER</Text>
              </View>
              <View style={styles.receiverCol}>
                <Text style={styles.headerText}>RECEIVER</Text>
              </View>
              <View style={styles.amountCol}>
                <Text style={styles.headerText}>AMOUNT</Text>
              </View>
              <View style={styles.statusCol}>
                <Text style={styles.headerText}>STATUS</Text>
              </View>
            </View>
            
            {/* Table Body */}
            {transactions.map((txn, index) => (
              <View 
                key={txn._id} 
                style={[
                  styles.tableRow, 
                  index === transactions.length - 1 ? styles.lastRow : {}
                ]}
              >
                <View style={styles.dateCol}>
                  <Text style={styles.bodyText}>
                    {formatDate(txn.createdAt)}
                  </Text>
                </View>
                <View style={styles.senderCol}>
                  <Text style={styles.bodyText}>
                    {txn.senderAccountId.userId.fullName}
                  </Text>
                  <Text style={styles.emailText}>
                    {txn.senderAccountId.userId.email}
                  </Text>
                </View>
                <View style={styles.receiverCol}>
                  <Text style={styles.bodyText}>
                    {txn.receiverAccountId.userId.fullName}
                  </Text>
                  <Text style={styles.emailText}>
                    {txn.receiverAccountId.userId.email}
                  </Text>
                </View>
                <View style={styles.amountCol}>
                  <Text style={styles.bodyText}>
                    ${txn.amount.toFixed(2)}
                  </Text>
                </View>
                <View style={styles.statusCol}>
                  <Text style={[styles.bodyText, { color: '#2c5282' }]}>
                    Completed
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Summary Section */}
        <View style={styles.summarySection}>          
          <View style={[styles.summaryRow, styles.grandTotal]}>
            <Text style={[styles.summaryLabel, styles.grandTotalText]}>TOTAL:</Text>
            <Text style={[styles.summaryValue, styles.grandTotalText]}>${grandTotal.toFixed(2)}</Text>
          </View>
        </View>

        
      </Page>
    </Document>
  );
};

export default Invoice;