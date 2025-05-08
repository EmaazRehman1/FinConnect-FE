// src/components/admin/UserManagement.tsx
import { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  MoreVertical,
  User,
  Mail,
  Calendar,
  XCircle,
  CheckCircle,
  Loader2
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface User {
  _id: string;
  fullName: string;
  email: string;
  role: 'admin' | 'developer';
  subscriptionStatus: 'active' | "canceled" | 'inactive';
  // isSubscribed:boolean,
  balance:number
}
import toast from 'react-hot-toast';
import { Toaster } from 'react-hot-toast';

import finteckApi from '@/axios/Axios';
import { useUser } from '@/context/UserContextProvider';
export function UserManagement() {
  
  const { accessToken } = useUser()
  const [users, setUsers] = useState<User[]>()

  const cancelSubscription = (userId: string) => {
    setUsers(users?.map(user =>
      user._id === userId
        ? { ...user, subscriptionStatus: "canceled" }
        : user
    ));
  };

  const activateSubscription = (userId: string) => {
    setUsers(users?.map(user =>
      user._id === userId
        ? { ...user, subscriptionStatus: 'active' }
        : user
    ));
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge >Active</Badge>;
      case 'canceled':
        return <Badge variant="destructive">Cancelled</Badge>;
      case 'expired':
        return <Badge variant="secondary">Expired</Badge>;
      case 'inactive':
        return <Badge variant="destructive">inactive</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  const cancelSubs = async (userId: string) => {
    console.log(userId)
    try {
      const response = await finteckApi.post(
        "/stripe/cancel-subscription",
        { userId },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
  
      toast.success(response.data.message || "Subscription canceled successfully");
  
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Failed to cancel subscription";
      toast.error(errorMessage);
      throw error;
    }
  };

  useEffect(() => {
    getUsers()
  }, [])

  const [loading, setLoading] = useState(false)
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
  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center h-[300px]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }


  return (
    <div className="p-6">
      <Toaster/>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">User Management</h2>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Balance</TableHead>
              <TableHead>Status</TableHead>
              {/* <TableHead>Joined</TableHead>
              <TableHead>Last Active</TableHead> */}
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users?.map((user) => (
              <TableRow key={user._id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    {user.fullName}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    {user.email}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {user.balance} $
                  </div>
                </TableCell>
                <TableCell>
                  {getStatusBadge(user?.subscriptionStatus)}
                </TableCell>
                {/* <TableCell>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    {new Date(user.joinDate).toLocaleDateString()}
                  </div>
                </TableCell> */}
                {/* <TableCell>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    {new Date(user.lastActive).toLocaleDateString()}
                  </div>
                </TableCell> */}
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {user?.subscriptionStatus === 'active' ? (
                        <DropdownMenuItem
                          onClick={() => cancelSubs(user._id)}
                          className="text-destructive"
                        >
                          <XCircle className="mr-2 h-4 w-4" />
                          Cancel Subscription
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem
                          onClick={() => activateSubscription(user._id)}
                          className="text-green-600"
                        >
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Activate Subscription
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}