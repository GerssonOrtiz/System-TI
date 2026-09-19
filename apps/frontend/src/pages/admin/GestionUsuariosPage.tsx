import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Eye, EyeOff } from 'lucide-react';
import { usersApi } from '@/api/users.api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Role } from '@sistema-ti/shared';

export function GestionUsuariosPage() {
  const queryClient = useQueryClient();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isPasswordOpen, setIsPasswordOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  // Form states
  const [formData, setFormData] = useState({ fullName: '', username: '', password: '', role: Role.SOLICITANTE });
  const [newPassword, setNewPassword] = useState('');
  const [showCreatePassword, setShowCreatePassword] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: () => usersApi.list().then((res) => res.data.data),
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => usersApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setIsCreateOpen(false);
      setFormData({ fullName: '', username: '', password: '', role: Role.SOLICITANTE });
    },
  });

  const passwordMutation = useMutation({
    mutationFn: ({ id, password }: { id: string; password: string }) => usersApi.updatePassword(id, { password }),
    onSuccess: () => {
      setIsPasswordOpen(false);
      setNewPassword('');
    },
  });

  const toggleStatusMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) => usersApi.toggleStatus(id, isActive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  const handlePasswordReset = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedUser) passwordMutation.mutate({ id: selectedUser.id, password: newPassword });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestión de Usuarios</h1>
          <p className="text-muted-foreground">Administra los accesos y credenciales del sistema.</p>
        </div>

        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>Nuevo Usuario</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Registrar nuevo usuario</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Nombre Completo</Label>
                <Input
                  id="fullName"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="username">Nombre de Usuario (ID)</Label>
                <Input
                  id="username"
                  required
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showCreatePassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    className="pr-10"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowCreatePassword(!showCreatePassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none"
                    tabIndex={-1}
                    aria-label={showCreatePassword ? 'Ocultar contraseña' : 'Ver contraseña'}
                  >
                    {showCreatePassword ? (
                      <EyeOff className="h-4 w-4" aria-hidden="true" />
                    ) : (
                      <Eye className="h-4 w-4" aria-hidden="true" />
                    )}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Rol</Label>
                <Select
                  value={formData.role}
                  onValueChange={(val) => setFormData({ ...formData, role: val as Role })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={Role.SOLICITANTE}>Solicitante</SelectItem>
                    <SelectItem value={Role.ADMIN_TI}>Administrador TI</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={createMutation.isPending}>
                  {createMutation.isPending ? 'Guardando...' : 'Crear Usuario'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border border-border bg-card text-card-foreground shadow-sm">
        <div className="p-0 overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="border-b bg-muted/50 text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Nombre</th>
                <th className="px-4 py-3 font-medium">Usuario</th>
                <th className="px-4 py-3 font-medium">Rol</th>
                <th className="px-4 py-3 font-medium">Estado</th>
                <th className="px-4 py-3 font-medium text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <tr key={i}>
                    <td className="px-4 py-3"><Skeleton className="h-5 w-32" /></td>
                    <td className="px-4 py-3"><Skeleton className="h-5 w-24" /></td>
                    <td className="px-4 py-3"><Skeleton className="h-5 w-20" /></td>
                    <td className="px-4 py-3"><Skeleton className="h-5 w-16" /></td>
                    <td className="px-4 py-3 text-right"><Skeleton className="h-5 w-10 ml-auto" /></td>
                  </tr>
                ))
              ) : (
                data?.map((u) => (
                  <tr key={u.id} className="transition-colors hover:bg-muted/50">
                    <td className="px-4 py-3 font-medium">{u.fullName}</td>
                    <td className="px-4 py-3">{u.username}</td>
                    <td className="px-4 py-3">
                      <Badge variant={u.role === Role.ADMIN_TI ? 'default' : 'secondary'}>
                        {u.role === Role.ADMIN_TI ? 'Admin' : 'Solicitante'}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={u.isActive ? 'default' : 'destructive'} className={u.isActive ? 'bg-status-approved' : ''}>
                        {u.isActive ? 'Activo' : 'Inactivo'}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-right space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedUser(u);
                          setIsPasswordOpen(true);
                        }}
                      >
                        Clave
                      </Button>
                      <Button
                        variant={u.isActive ? 'destructive' : 'default'}
                        size="sm"
                        onClick={() => toggleStatusMutation.mutate({ id: u.id, isActive: !u.isActive })}
                        disabled={toggleStatusMutation.isPending}
                      >
                        {u.isActive ? 'Desactivar' : 'Activar'}
                      </Button>
                    </td>
                  </tr>
                ))
              )}
              {data?.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                    No se encontraron usuarios
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={isPasswordOpen} onOpenChange={setIsPasswordOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cambiar contraseña de {selectedUser?.fullName}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handlePasswordReset} className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="newPassword">Nueva Contraseña</Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showResetPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  className="pr-10"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowResetPassword(!showResetPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none"
                  tabIndex={-1}
                  aria-label={showResetPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
                >
                  {showResetPassword ? (
                    <EyeOff className="h-4 w-4" aria-hidden="true" />
                  ) : (
                    <Eye className="h-4 w-4" aria-hidden="true" />
                  )}
                </button>
              </div>
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsPasswordOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={passwordMutation.isPending}>
                {passwordMutation.isPending ? 'Guardando...' : 'Actualizar Contraseña'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
