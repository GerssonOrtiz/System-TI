import os
import glob

def replace_in_file(path, old, new):
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    new_content = content.replace(old, new)
    if new_content != content:
        with open(path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated {path}")

base_dir = 'C:/Users/gorti/Desktop/System-TI/apps/backend/src'
for root, dirs, files in os.walk(base_dir):
    for file in files:
        if file.endswith('.ts'):
            path = os.path.join(root, file)
            replace_in_file(path, "email: user.username", "username: user.username")
            replace_in_file(path, "email: input.username", "username: input.username")
            replace_in_file(path, "correo electrónico", "nombre de usuario")
            replace_in_file(path, "EMAIL_ALREADY_EXISTS", "USERNAME_ALREADY_EXISTS")
            replace_in_file(path, "PublicUser['email']", "PublicUser['username']")
