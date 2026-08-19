import { Navigate, Outlet } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

function AdminRoute() {
  const {
    user,
    isAuthenticated,
    isLoading,
  } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F7F6F2]">
        <p className="text-sm font-semibold text-[#737373]">
          Loading...
        </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  if (user?.role !== "ADMIN") {
    return (
      <Navigate
        to="/"
        replace
      />
    );
  }

  return <Outlet />;
}

export default AdminRoute;