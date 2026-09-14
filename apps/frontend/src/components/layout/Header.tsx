import { useLocation } from 'react-router-dom';
import { Menu } from 'lucide-react';

import { Role } from '@sistema-ti/shared';

import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/authStore';

const pageTitles: Record<string, string> = {
  '/tickets': 'Mis Tickets',
  '/tickets/nuevo': 'Nuevo Ticket',
  '/conocimiento': 'Base de Conocimiento',
  '/admin/dashboard': 'Dashboard',
  '/admin/tickets': 'Gestión de Tickets',
  '/admin/tareas': 'Tablero de Tareas',
  '/admin/articulos': 'Gestión de Artículos',
};

interface HeaderProps {
  onMenuToggle?: () => void;
}

export function Header({ onMenuToggle }: HeaderProps) {
  const location = useLocation();
  const { user } = useAuthStore();

  // Busca título exacto o por prefijo
  const pageTitle =
    pageTitles[location.pathname] ??
    Object.entries(pageTitles).find(([path]) => location.pathname.startsWith(path + '/'))?.[1] ??
    'Sistema de Gestión de TI';

  return (
    <header className="flex h-16 items-center border-b bg-card px-4 lg:px-6">
      {/* Botón de menú para mobile */}
      <Button
        variant="ghost"
        size="icon"
        className="mr-4 lg:hidden"
        onClick={onMenuToggle}
        aria-label="Abrir menú de navegación"
      >
        <Menu className="h-5 w-5" aria-hidden="true" />
      </Button>

      {/* Título de la página */}
      <h1 className="text-xl font-semibold">{pageTitle}</h1>

      {/* Espacio flexible */}
      <div className="flex-1" />

      {/* Info del usuario (visible en desktop) */}
      {user && (
        <div className="hidden items-center gap-2 lg:flex" aria-label="Usuario actual">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground"
            aria-hidden="true"
          >
            {user.fullName.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-medium leading-none">{user.fullName}</p>
            <p className="text-xs text-muted-foreground">
              {user.role === Role.ADMIN_TI ? 'Administrador TI' : 'Solicitante'}
            </p>
          </div>
        </div>
      )}
    </header>
  );
}
