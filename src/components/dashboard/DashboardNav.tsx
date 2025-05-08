// Update DashboardNav.tsx
import { MobileSidebar } from "./MobileSidebar";
import { Link } from "react-router-dom";
import { UserDropdown } from "./UserDropdown";

export function DashboardNav() {
  return (
    <header className="bg-white shadow-sm">
      <div className="flex items-center justify-between px-4 py-3 sm:px-6">
        <div className="flex items-center space-x-4">
          <MobileSidebar />
          <Link to="/" className="text-md font-semibold text-gray-900 hover:text-gray-700">
            Home
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          <UserDropdown />
        </div>
      </div>
    </header>
  );
}