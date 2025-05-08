import { 
  BarChart, 
  LineChart,
  Users,
  ArrowLeftRight,
  Activity,
  Clock,
  User as UserIcon,
  CreditCard,
  AlertCircle,
  CheckCircle,
  Shield
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useUser } from '@/context/UserContextProvider';
import { useEffect, useState } from 'react';
interface User {
  _id: string;
  fullName: string;
  email: string;
  role: 'admin' | 'developer';
  subscriptionStatus: 'active' | "canceled" | 'inactive';
  // isSubscribed:boolean,
  balance:number
}
import finteckApi from '@/axios/Axios';
export function AdminDashboardHome() {
  const { user,accessToken } = useUser();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch users from API
  useEffect(() => {
    const getUsers = async () => {
      setLoading(true)
      try {
        const response = await finteckApi.get('/admin/users-data', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
  
        setUsers(response.data)
        console.log(response?.data);
        console.log("Fetched users:", users);
  
        return users;
  
      } catch (error: any) {
        const errorMsg =
          error?.response?.data?.message ||
          error?.message ||
          "Failed to fetch users";
  
        console.error("Error fetching users:", errorMsg);
      } finally {
        setLoading(false)
      }
    };
  

    getUsers();
  }, []);

  // Calculate user counts
  const totalUsers = users.length;
  // const verifiedUsers = users.filter(u => u.status === 'verified').length;
  // const pendingUsers = users.filter(u => u.status === 'pending').length;
  const subscribedUsers = users.filter(u => u.subscriptionStatus === 'active').length;
  const cancelledUsers = users.filter(u => u.subscriptionStatus === "canceled").length;
  const inactive = users.filter(u => u.subscriptionStatus === "inactive").length;




  return (
    <div className="space-y-6">
      {/* Header with current admin user info */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
          {user && (
            <p className="text-sm text-gray-500">
              Logged in as: {user.fullName} ({user.email})
            </p>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">Last updated: {new Date().toLocaleString()}</span>
        </div>
      </div>

      {/* User Count Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Total Users</span>
            <Users className="h-4 w-4 text-gray-500" />
          </div>
          {loading ? (
            <div className="animate-pulse h-6 bg-gray-200 rounded mt-1"></div>
          ) : error ? (
            <div className="text-red-500 text-sm">{error}</div>
          ) : (
            <div className="text-xl font-semibold mt-1">{totalUsers}</div>
          )}
        </div>
        
        <div className="border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Subscribed Users</span>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </div>
          {loading ? (
            <div className="animate-pulse h-6 bg-gray-200 rounded mt-1"></div>
          ) : error ? (
            <div className="text-red-500 text-sm">{error}</div>
          ) : (
            <div className="text-xl font-semibold mt-1">{subscribedUsers}</div>
          )}
        </div>
        
        <div className="border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Total cancellation</span>
            <Clock className="h-4 w-4 text-yellow-500" />
          </div>
          {loading ? (
            <div className="animate-pulse h-6 bg-gray-200 rounded mt-1"></div>
          ) : error ? (
            <div className="text-red-500 text-sm">{error}</div>
          ) : (
            <div className="text-xl font-semibold mt-1">{cancelledUsers}</div>
          )}
        </div>

        <div className="border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Inactive Users</span>
            <Clock className="h-4 w-4 text-red-500" />
          </div>
          {loading ? (
            <div className="animate-pulse h-6 bg-gray-200 rounded mt-1"></div>
          ) : error ? (
            <div className="text-red-500 text-sm">{error}</div>
          ) : (
            <div className="text-xl font-semibold mt-1">{inactive}</div>
          )}
        </div>
      
      </div>

      {/* User Management Preview */}
      <div className="border rounded-lg">
        <div className="p-6">
          <h3 className="text-lg font-medium">Recent Users</h3>
        </div>
        <div className="px-6 pb-6">
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="h-9 w-9 rounded-full bg-gray-200 animate-pulse"></div>
                    <div className="space-y-2">
                      <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-3 w-48 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  </div>
                  <div className="h-8 w-20 bg-gray-200 rounded-md animate-pulse"></div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-red-500">{error}</div>
          ) : (
            <div className="space-y-4">
              {users.slice(0, 3).map((user) => (
                <div key={user._id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="h-9 w-9 rounded-full bg-gray-100 flex items-center justify-center">
                      {user.fullName.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{user.fullName}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </div>
                </div>
              ))}
              <Link to="/admin/dashboard/userManagement" className="w-full text-center block text-blue-600 text-sm hover:underline">
                View all users
              </Link>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}