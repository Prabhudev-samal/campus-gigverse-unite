import { Navigate } from "react-router-dom";
import { useRole } from "@/hooks/useRole";

export function AdminRoute({ children }: { children: React.ReactNode }) {
  const role = useRole();
  if (role === null) return <div className="p-8 text-center">Loading...</div>;
  if (role !== "admin") return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}

export function UserRoute({ children }: { children: React.ReactNode }) {
  const role = useRole();
  if (role === null) return <div className="p-8 text-center">Loading...</div>;
  if (role === "admin") return <Navigate to="/admin" replace />;
  return <>{children}</>;
}