import os

users_api = 'C:/Users/gorti/Desktop/System-TI/apps/frontend/src/api/users.api.ts'
with open(users_api, 'r', encoding='utf-8') as f:
    content = f.read()

new_methods = """
  create: (data: any) => axiosClient.post<{ success: true; data: PublicUser }>('/users', data),
  updatePassword: (id: string, data: any) => axiosClient.put<{ success: true }>(`/users/${id}/password`, data),
  toggleStatus: (id: string, isActive: boolean) => axiosClient.put<{ success: true }>(`/users/${id}/status`, { isActive }),
"""

if 'updatePassword' not in content:
    content = content.replace("getMetrics: () =>\n    axiosClient.get<{ success: true; data: DashboardMetrics }>('/dashboard/metrics'),", 
    "getMetrics: () =>\n    axiosClient.get<{ success: true; data: DashboardMetrics }>('/dashboard/metrics'),\n" + new_methods)
    with open(users_api, 'w', encoding='utf-8') as f:
        f.write(content)

sidebar = 'C:/Users/gorti/Desktop/System-TI/apps/frontend/src/components/layout/Sidebar.tsx'
with open(sidebar, 'r', encoding='utf-8') as f:
    content = f.read()

if 'Usuarios' not in content:
    content = content.replace(
        "{ name: 'Base de Conocimiento', href: '/admin/articulos', icon: BookOpen },",
        "{ name: 'Base de Conocimiento', href: '/admin/articulos', icon: BookOpen },\n  { name: 'Usuarios', href: '/admin/usuarios', icon: Users },"
    )
    content = content.replace("import { BookOpen, CheckSquare, LayoutDashboard, LogOut, Ticket, Menu } from 'lucide-react';", 
                              "import { BookOpen, CheckSquare, LayoutDashboard, LogOut, Ticket, Menu, Users } from 'lucide-react';")
    with open(sidebar, 'w', encoding='utf-8') as f:
        f.write(content)

router = 'C:/Users/gorti/Desktop/System-TI/apps/frontend/src/router/AppRouter.tsx'
with open(router, 'r', encoding='utf-8') as f:
    content = f.read()

if 'GestionUsuariosPage' not in content:
    content = content.replace(
        "import { UnauthorizedPage } from '@/pages/UnauthorizedPage';",
        "import { GestionUsuariosPage } from '@/pages/admin/GestionUsuariosPage';\nimport { UnauthorizedPage } from '@/pages/UnauthorizedPage';"
    )
    content = content.replace(
        '<Route path="articulos" element={<GestionArticulosPage />} />',
        '<Route path="articulos" element={<GestionArticulosPage />} />\n              <Route path="usuarios" element={<GestionUsuariosPage />} />'
    )
    with open(router, 'w', encoding='utf-8') as f:
        f.write(content)

print("Nav & API patched!")
