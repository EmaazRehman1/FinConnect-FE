// src/components/dashboard/UserDropdown.tsx
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LogOut, Settings, User, LayoutDashboard } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../Hooks/UseAuth';
import { useUser } from '@/context/UserContextProvider';
import finteckApi from '@/axios/Axios';
import { useState } from 'react';
import FullPageLoader from '../Shared/Loader';

export function UserDropdown() {
  const { user, logout } = useUser()
  const [loading, setLoading] = useState(false)
  const handleLogout = async () => {
    setLoading(true)
    try {
      const response = await logout()
      console.log(response);
    } catch (error: any) {
      console.log(error)
    } finally {
      setLoading(false)
    }
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  if (loading) {
    return <FullPageLoader />
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src='https://www.w3schools.com/w3images/avatar2.png' alt="error" />
            <AvatarFallback>User</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user?.fullName}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {/* <DropdownMenuItem asChild>
            <Link to="/dashboard/settings" className="w-full">
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </Link>
          </DropdownMenuItem> */}
          {user?.role === 'admin' ? (
            <DropdownMenuItem asChild>
              <Link to="/admin/dashboard" className="w-full">
                <Settings className="mr-2 h-4 w-4" />
                <span>Dashboard</span>
              </Link>
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem asChild>
              <Link to="/dashboard" className="w-full">
                <LayoutDashboard className="mr-2 h-4 w-4" />
                <span>Dashboard</span>
              </Link>
            </DropdownMenuItem>
          )}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}