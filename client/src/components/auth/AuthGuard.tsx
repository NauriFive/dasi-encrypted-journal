import { Navigate } from "react-router-dom";
import { useMe } from "@/hooks/useMe";
import type { ReactNode } from "react";

const AuthGuard = ({ children }: { children: ReactNode }) => {
  const { isPending, isError } = useMe();

  if (isPending) return null;
  if (isError) return <Navigate to="/signin" replace />;
  return <>{children}</>;
};

export default AuthGuard;
