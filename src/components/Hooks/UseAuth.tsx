// src/hooks/useAuth.ts
import { useEffect, useState } from 'react';
// import { jwtDecode } from 'jwt-decode';
// import { getAccessToken } from '@/lib/auth';

interface User{
  id:string,
  name:string,
  role:'admin' | 'user',
  email:string
}
interface AuthState {
  isAuthenticated: boolean;
  isSubscribed: boolean;
  isLoading: boolean;
  user: User;
}
export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: true,
    isSubscribed: true,
    isLoading: true,
    user: {
      id: '1',
      name: 'tst User',
      role: 'admin',
      email: 'test@example.com'
    },
  });

//   useEffect(() => {
//     const checkAuth = async () => {
//    
//       const token = localStorage.getItem("token")
      
//       if (!token) {
//         setAuthState({
//           isAuthenticated: false,
//           isSubscribed: false,
//           isLoading: false,
//           user: null,
//         });
//         return;
//       }

//       try {
//         // const decoded = jwtDecode(token);
//         const decoded=JSON.parse(localStorage.getItem('user')!)
//         const isSubscribed = decoded.subscriptionStatus === 'active';
        
//         setAuthState({
//           isAuthenticated: true,
//           isSubscribed,
//           isLoading: false,
//           user: decoded,
//         });
//       } catch (error) {
//         localStorage.removeItem('accessToken');
//         setAuthState({
//           isAuthenticated: false,
//           isSubscribed: false,
//           isLoading: false,
//           user: null,
//         });
//       }
//     };

//     checkAuth();
//   }, []);

  return {
    ...authState,
  };
}