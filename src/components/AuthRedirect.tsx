import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useUser } from "@/context/UserContextProvider";
import FullPageLoader from "./Shared/Loader";

export default function AuthRedirect({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading) {
      if (user?.isAuthenticated) {
        if (user.role === "admin") {
          navigate("/admin/dashboard", { replace: true });
        } else if (user.role === "developer" && user.isSubscribed) {
          navigate("/dashboard", { replace: true });
        } else if (user.role === "developer" && !user.isSubscribed) {
          navigate("/pricing", { replace: true });
        }
      }
    }
  }, [isLoading, user, navigate]);

  console.log(isLoading);
  console.log(user?.isAuthenticated === undefined);
  console.log(user?.isAuthenticated);

  if (isLoading && user?.isAuthenticated === undefined) {
    return <FullPageLoader />;
  }

  return <Outlet />;
}
