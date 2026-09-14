import { Navigate, Route, Routes } from 'react-router-dom';
import { Role } from '@sistema-ti/shared';

import { AppShell } from '@/components/layout/AppShell';
import { LoginPage } from '@/pages/auth/LoginPage';
import { BaseConocimientoPage } from '@/pages/solicitante/BaseConocimientoPage';
import { MisTicketsPage } from '@/pages/solicitante/MisTicketsPage';
import { NuevoTicketPage } from '@/pages/solicitante/NuevoTicketPage';
import { TicketDetallePage } from '@/pages/solicitante/TicketDetallePage';
import { DashboardPage } from '@/pages/admin/DashboardPage';
import { GestionTicketsPage } from '@/pages/admin/GestionTicketsPage';
import { TableroTareasPage } from '@/pages/admin/TableroTareasPage';
import { GestionArticulosPage } from '@/pages/admin/GestionArticulosPage';
import { UnauthorizedPage } from '@/pages/UnauthorizedPage';
import { useAuthStore } from '@/store/authStore';
import { ProtectedRoute } from './ProtectedRoute';
import { RoleRoute } from './RoleRoute';

export function AppRouter() {
  const { user } = useAuthStore();

  const getDefaultRedirect = () => {
    if (!user) return '/login';
    return user.role === Role.ADMIN_TI ? '/admin/dashboard' : '/solicitante/tickets';
  };

  return (
    <Routes>
      {/* Ruta pública */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/no-autorizado" element={<UnauthorizedPage />} />

      {/* Rutas protegidas dentro del AppShell */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppShell />}>
          {/* Redirección dinámica según rol en la raíz */}
          <Route path="/" element={<Navigate to={getDefaultRedirect()} replace />} />

          {/* Rutas para Solicitante / Usuario general */}
          <Route path="/solicitante">
            <Route path="tickets" element={<MisTicketsPage />} />
            <Route path="tickets/nuevo" element={<NuevoTicketPage />} />
            <Route path="tickets/:id" element={<TicketDetallePage />} />
            <Route path="base-conocimiento" element={<BaseConocimientoPage />} />
            <Route path="base-conocimiento/:slug" element={<BaseConocimientoPage />} />
          </Route>

          {/* Alias directos para tickets */}
          <Route path="/tickets" element={<Navigate to="/solicitante/tickets" replace />} />
          <Route path="/tickets/nuevo" element={<Navigate to="/solicitante/tickets/nuevo" replace />} />
          <Route path="/tickets/:id" element={<TicketDetallePage />} />

          {/* Rutas para Admin TI */}
          <Route element={<RoleRoute allowedRoles={[Role.ADMIN_TI]} />}>
            <Route path="/admin">
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="tickets" element={<GestionTicketsPage />} />
              <Route path="tareas" element={<TableroTareasPage />} />
              <Route path="articulos" element={<GestionArticulosPage />} />
            </Route>
          </Route>
        </Route>
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
