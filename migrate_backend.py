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
            # Be careful with replacements
            replace_in_file(path, "findByEmail", "findByUsername")
            replace_in_file(path, "email: string", "username: string")
            replace_in_file(path, "email: data.email", "username: data.username")
            replace_in_file(path, "where: { email }", "where: { username }")
            replace_in_file(path, "email: email", "username: username")
            replace_in_file(path, ".email", ".username")
            replace_in_file(path, "email,", "username,")
