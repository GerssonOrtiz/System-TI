import os

def append_to_file(path, content):
    with open(path, 'a', encoding='utf-8') as f:
        f.write(content)

# For users.service.ts, we can just replace the end `};` with the new methods and `};`
def patch_service(path):
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    new_methods = """
  async createUser(data: import('@sistema-ti/shared').RegisterInput) {
    const existing = await usersRepository.findByUsername(data.username);
    if (existing) throw ApiError.conflict('USERNAME_ALREADY_EXISTS', 'Ya existe una cuenta con ese usuario');
    
    const bcrypt = require('bcryptjs');
    const passwordHash = await bcrypt.hash(data.password, 12);
    
    return usersRepository.create({
      fullName: data.fullName,
      username: data.username,
      passwordHash,
      role: data.role as Role,
    });
  },

  async resetPassword(targetId: string, newPassword: string) {
    const user = await usersRepository.findById(targetId);
    if (!user) throw ApiError.notFound('USER_NOT_FOUND', 'Usuario no encontrado');
    
    const bcrypt = require('bcryptjs');
    const passwordHash = await bcrypt.hash(newPassword, 12);
    
    await usersRepository.updatePassword(targetId, passwordHash);
    return { success: true };
  },

  async toggleStatus(targetId: string, isActive: boolean) {
    const user = await usersRepository.findById(targetId);
    if (!user) throw ApiError.notFound('USER_NOT_FOUND', 'Usuario no encontrado');
    
    return usersRepository.update(targetId, { isActive });
  },
};
"""
    # Fix the missing create/updatePassword in repository
    if "};" in content:
        content = content.rsplit("};", 1)[0] + new_methods
        with open(path, 'w', encoding='utf-8') as f:
            f.write(content)
        print("Patched users.service.ts")

def patch_controller(path):
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
        
    new_methods = """
  /** POST /api/v1/users */
  createUser: asyncHandler(async (req: Request, res: Response) => {
    const result = await usersService.createUser(req.body as any);
    return ApiResponse.created(res, result, 'Usuario creado correctamente');
  }),

  /** PUT /api/v1/users/:id/password */
  resetPassword: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { password } = req.body;
    await usersService.resetPassword(id, password);
    return ApiResponse.success(res, null, 200, 'Contraseña actualizada');
  }),

  /** PUT /api/v1/users/:id/status */
  toggleStatus: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { isActive } = req.body;
    const result = await usersService.toggleStatus(id, isActive);
    return ApiResponse.success(res, result, 200, 'Estado actualizado');
  }),
};
"""
    if "};" in content:
        content = content.rsplit("};", 1)[0] + new_methods
        with open(path, 'w', encoding='utf-8') as f:
            f.write(content)
        print("Patched users.controller.ts")

def patch_routes(path):
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
        
    new_methods = """
// Gestión de usuarios (Solo ADMIN_TI)
usersRouter.post('/', authorize([Role.ADMIN_TI]), usersController.createUser);
usersRouter.put('/:id/password', authorize([Role.ADMIN_TI]), usersController.resetPassword);
usersRouter.put('/:id/status', authorize([Role.ADMIN_TI]), usersController.toggleStatus);
"""
    content += new_methods
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Patched users.routes.ts")

service_path = 'C:/Users/gorti/Desktop/System-TI/apps/backend/src/modules/users/users.service.ts'
controller_path = 'C:/Users/gorti/Desktop/System-TI/apps/backend/src/modules/users/users.controller.ts'
routes_path = 'C:/Users/gorti/Desktop/System-TI/apps/backend/src/modules/users/users.routes.ts'

patch_service(service_path)
patch_controller(controller_path)
patch_routes(routes_path)
