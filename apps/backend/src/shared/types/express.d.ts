import type { Role } from '@sistema-ti/shared';

// Extiende el tipo Request de Express para incluir el usuario autenticado
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: Role;
        username: string;
      };
    }
  }
}
