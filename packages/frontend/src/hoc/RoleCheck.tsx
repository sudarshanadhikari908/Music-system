import { useAppSelector } from "@/store/redux-Hooks";
import React from "react";

type Role = "super_admin" | "artist_manager" | "artist";

interface RoleCheckProps {
  allowedRoles: Role[];
  children: React.ReactNode;
}

const RoleCheck: React.FC<RoleCheckProps> = ({ allowedRoles, children }) => {
  const { userProfile } = useAppSelector((state) => state.user);

  if (userProfile && allowedRoles.includes(userProfile.role as Role)) {
    return <>{children}</>;
  }

  return null;
};

export default RoleCheck;
