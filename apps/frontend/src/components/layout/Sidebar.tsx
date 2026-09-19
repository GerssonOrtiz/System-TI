import { Link, useLocation } from 'react-router-dom';
import {
  BookOpen,
  CheckSquare,
  LayoutDashboard,
  LogOut,
  Settings,
  Ticket,
  Users,
} from 'lucide-react';

import { Role } from '@sistema-ti/shared';

import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/authStore';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  roles: Role[];
}

const navItems: NavItem[] = [
  // Admin TI
  {
    label: 'Dashboard',
    href: '/admin/dashboard',
    icon: <LayoutDashboard className="h-4 w-4" aria-hidden="true" />,
    roles: [Role.ADMIN_TI],
  },
  {
    label: 'Gestión de Tickets',
    href: '/admin/tickets',
    icon: <Ticket className="h-4 w-4" aria-hidden="true" />,
    roles: [Role.ADMIN_TI],
  },
  {
    label: 'Tareas',
    href: '/admin/tareas',
    icon: <CheckSquare className="h-4 w-4" aria-hidden="true" />,
    roles: [Role.ADMIN_TI],
  },
  {
    label: 'Artículos KB',
    href: '/admin/articulos',
    icon: <BookOpen className="h-4 w-4" aria-hidden="true" />,
    roles: [Role.ADMIN_TI],
  },
  {
    label: 'Usuarios y Accesos',
    href: '/admin/usuarios',
    icon: <Users className="h-4 w-4" aria-hidden="true" />,
    roles: [Role.ADMIN_TI],
  },
  // Solicitante
  {
    label: 'Mis Tickets',
    href: '/tickets',
    icon: <Ticket className="h-4 w-4" aria-hidden="true" />,
    roles: [Role.SOLICITANTE],
  },
  {
    label: 'Base de Conocimiento',
    href: '/conocimiento',
    icon: <BookOpen className="h-4 w-4" aria-hidden="true" />,
    roles: [Role.SOLICITANTE],
  },
];

export function Sidebar() {
  const location = useLocation();
  const { user, clearAuth } = useAuthStore();

  if (!user) return null;

  const visibleItems = navItems.filter((item) => item.roles.includes(user.role as Role));

  return (
    <aside
      className="flex h-full w-64 flex-col border-r bg-card"
      aria-label="Navegación principal"
    >
      {/* Logo */}
      <div className="flex h-16 items-center border-b px-6">
        <Settings className="mr-2 h-6 w-6 text-primary" aria-hidden="true" />
        <span className="text-lg font-semibold">Sistema TI</span>
      </div>

      {/* Navegación */}
      <nav className="flex-1 overflow-y-auto p-4">
        <ul className="space-y-1" role="list">
          {visibleItems.map((item) => {
            const isActive = location.pathname === item.href || location.pathname.startsWith(item.href + '/');
            return (
              <li key={item.href}>
                <Link
                  to={item.href}
                  className={cn(
                    'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                  )}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {item.icon}
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer del sidebar: info usuario + logout */}
      <div className="border-t p-4">
        <div className="mb-3 flex items-center gap-3">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground"
            aria-hidden="true"
          >
            {user.fullName.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{user.fullName}</p>
            <p className="truncate text-xs text-muted-foreground">
              {user.role === Role.ADMIN_TI ? 'Administrador TI' : 'Solicitante'}
            </p>
          </div>
        </div>
        <button
          onClick={clearAuth}
          className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="Cerrar sesión"
        >
          <LogOut className="h-4 w-4" aria-hidden="true" />
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
