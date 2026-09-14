import { ShieldAlert } from 'lucide-react';
import { Link } from 'react-router-dom';

import { Button } from '@/components/ui/button';

export function UnauthorizedPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6 space-y-4">
      <ShieldAlert className="h-16 w-16 text-destructive" />
      <h1 className="text-3xl font-bold">Acceso Denegado (403)</h1>
      <p className="text-muted-foreground max-w-md">
        No tienes los permisos necesarios para acceder a esta página. Esta sección requiere un rol administrativo.
      </p>
      <Button asChild>
        <Link to="/">Volver al Inicio</Link>
      </Button>
    </div>
  );
}
