import { Navigate, Outlet } from 'react-router-dom';

import type { Role } from '@sistema-ti/shared';

import { useAuthStore } from '@/store/authStore';

interface RoleRouteProps {
  allowedRoles: Role[];
}

/** Redirige a /no-autorizado si el rol del usuario no coincide */
export function RoleRoute({ allowedRoles }: RoleRouteProps) {
  const { user } = useAuthStore();

  if (!user || !allowedRoles.includes(user.role as Role)) {
    return <Navigate to="/no-autorizado" replace />;
  }

  return <Outlet />;
}
