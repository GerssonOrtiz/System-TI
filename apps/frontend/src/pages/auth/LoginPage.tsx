import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Loader2, Settings } from 'lucide-react';
import axios from 'axios';

import { LoginSchema, Role } from '@sistema-ti/shared';
import type { LoginInput } from '@sistema-ti/shared';

import { authApi } from '@/api/auth.api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuthStore } from '@/store/authStore';

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setAuth, isAuthenticated, user } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (isAuthenticated && user) {
      const from = (location.state as { from?: { pathname: string } })?.from?.pathname;
      if (from && from !== '/login') {
        navigate(from, { replace: true });
      } else {
        navigate(user.role === Role.ADMIN_TI ? '/admin/dashboard' : '/solicitante/tickets', { replace: true });
      }
    }
  }, [isAuthenticated, user, navigate, location.state]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<LoginInput>({
    resolver: zodResolver(LoginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    try {
      const response = await authApi.login(data);
      const { user: authUser, tokens } = response.data.data;
      setAuth(authUser, tokens.accessToken, tokens.refreshToken);

      const redirectTo = authUser.role === Role.ADMIN_TI ? '/admin/dashboard' : '/solicitante/tickets';
      navigate(redirectTo, { replace: true });
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const message = (err.response?.data as { error?: { message?: string } })?.error?.message;
        if (err.response?.status === 401) {
          setError('password', { message: message ?? 'Credenciales inválidas' });
        } else {
          toast.error(message ?? 'Error al iniciar sesión');
        }
      } else {
        toast.error('Error al conectar con el servidor');
      }
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg-base bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-bg-elevated via-bg-base to-black p-4">
      <Card className="w-full max-w-md border-border/50 bg-bg-surface/90 shadow-2xl backdrop-blur-sm">
        <CardHeader className="text-center">
          <div className="mb-4 flex justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary border border-primary/20 shadow-[0_0_15px_rgba(0,229,255,0.2)]">
              <Settings className="h-6 w-6" aria-hidden="true" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight text-foreground">Sistema de Gestión de TI</CardTitle>
          <CardDescription>Ingresa tus credenciales para continuar</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
            {/* Campo Usuario */}
            <div className="space-y-2">
              <Label htmlFor="username">Nombre de Usuario</Label>
              <Input
                id="username"
                type="text"
                placeholder="ej: mgarcia, jperez"
                autoComplete="username"
                aria-describedby={errors.username ? 'username-error' : undefined}
                aria-invalid={!!errors.username}
                {...register('username')}
              />
              {errors.username && (
                <p id="username-error" className="text-sm text-destructive" role="alert">
                  {errors.username.message as string}
                </p>
              )}
            </div>

            {/* Campo Contraseña */}
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="pr-10"
                  aria-describedby={errors.password ? 'password-error' : undefined}
                  aria-invalid={!!errors.password}
                  {...register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none"
                  tabIndex={-1}
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" aria-hidden="true" />
                  ) : (
                    <Eye className="h-4 w-4" aria-hidden="true" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p id="password-error" className="text-sm text-destructive" role="alert">
                  {errors.password.message as string}
                </p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                  Iniciando sesión...
                </>
              ) : (
                'Iniciar sesión'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
