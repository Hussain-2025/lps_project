import { Navigate, Outlet, useLocation } from "react-router-dom";

import { useAuth } from "../auth/AuthProvider";
import type { Role } from "../lib/types";

type RequireAuthProps = {
  allowedRoles?: Role[];
};

export function RequireAuth({ allowedRoles }: RequireAuthProps) {
  const { bootstrapped, user } = useAuth();
  const location = useLocation();

  if (!bootstrapped) {
    return (
      <div className="centered-shell">
        <div className="card surface-card">
          <p>Loading your session...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/erp/login" replace state={{ from: location.pathname }} />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <div className="centered-shell">
        <div className="card surface-card error-card">
          <h1>Access restricted</h1>
          <p>Your account does not have access to this section.</p>
        </div>
      </div>
    );
  }

  return <Outlet />;
}
