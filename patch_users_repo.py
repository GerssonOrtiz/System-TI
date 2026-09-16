import os

def patch_repository(path):
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Change email: true to username: true
    content = content.replace("email: true", "username: true")

    new_methods = """
  async findByUsername(username: string) {
    return prisma.user.findUnique({
      where: { username },
    });
  },

  async create(data: { fullName: string; username: string; passwordHash: string; role: Role }) {
    return prisma.user.create({
      data,
      select: publicUserSelect,
    });
  },

  async updatePassword(id: string, passwordHash: string) {
    return prisma.user.update({
      where: { id },
      data: { passwordHash },
      select: publicUserSelect,
    });
  },
};
"""
    if "};" in content:
        content = content.rsplit("};", 1)[0] + new_methods
        with open(path, 'w', encoding='utf-8') as f:
            f.write(content)
        print("Patched users.repository.ts")

patch_repository('C:/Users/gorti/Desktop/System-TI/apps/backend/src/modules/users/users.repository.ts')
