// layouts/AdminDashboardLayout.jsx
// import Sidebar from '../components/AdminSidebar';
import { AdminSidebar } from "@/components/AdminDashboard/AdminSideBar";
import { Outlet } from "react-router-dom";
import { DashboardNav } from "@/components/dashboard/DashboardNav";
import { useEffect } from "react";
const AdminDashboardLayout = () => {
//   return (
//     <div className="flex">
//       <AdminSidebar />
//       <div className="flex-1 p-4">
//         <Outlet />
//       </div>
//     </div>
//   );
  useEffect(()=>{
    console.log("inside admin dashboard")
  },[])
  return (
      <div className="flex min-h-screen bg-gray-50">
        {/* Sidebar */}
        <AdminSidebar />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top Navigation */}
          <DashboardNav />
          
          {/* Main Content */}
          <main className="flex-1 overflow-y-auto p-4 md:p-6">
            <Outlet />
          </main>
        </div>
      </div>
    );
};

export default AdminDashboardLayout;