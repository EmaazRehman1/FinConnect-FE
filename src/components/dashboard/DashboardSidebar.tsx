// src/components/dashboard/DashboardSidebar.tsx
import { NavLink } from 'react-router-dom';
import {
  Home,
  Wallet,
  ArrowLeftRight,
  History,
  FileText,
  Settings
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from "framer-motion";


export function DashboardSidebar() {
  const navItems = [
    { to: '/dashboard', icon: <Home className="h-5 w-5" />, label: 'Overview' },
    { to: '/dashboard/transfers', icon: <ArrowLeftRight className="h-5 w-5" />, label: 'Transfers' },
    { to: '/dashboard/transactions', icon: <History className="h-5 w-5" />, label: 'Transactions' },
    { to: '/dashboard/invoices', icon: <FileText className="h-5 w-5" />, label: 'Invoices' },
  ];

  return (
    <aside className="hidden md:flex md:flex-shrink-0">
      <div className="flex w-64 flex-col border-r border-gray-200 bg-white">
        <div className="flex h-0 flex-1 flex-col pt-5 pb-4">
          <Link to="/" className="flex items-center gap-2 w-full">
            <motion.div
              initial={{ rotate: -10, scale: 0.9 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="bg-gradient-to-r from-blue-600 to-cyan-400 h-8 w-8 rounded-lg flex items-center justify-center">
                <span className="font-bold text-white">FC</span>
              </div>
            </motion.div>
            <span className="font-bold text-xl hidden sm:block">FinConnect</span>
          </Link>
          <nav className="mt-5 flex-1 space-y-1 px-2">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  
                  `group flex items-center px-2 py-2 text-sm font-medium rounded-md ${isActive
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`
                }
              >
                <span className="mr-3 text-gray-400 group-hover:text-gray-500">
                  {item.icon}
                </span>
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>
    </aside>
  );
}