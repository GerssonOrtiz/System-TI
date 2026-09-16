import os

def replace_in_file(path, old, new):
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    new_content = content.replace(old, new)
    if new_content != content:
        with open(path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated {path}")

login_path = 'C:/Users/gorti/Desktop/System-TI/apps/frontend/src/pages/auth/LoginPage.tsx'
replace_in_file(login_path, 'htmlFor="email"', 'htmlFor="username"')
replace_in_file(login_path, 'id="email"', 'id="username"')
replace_in_file(login_path, 'type="email"', 'type="text"')
replace_in_file(login_path, 'autoComplete="email"', 'autoComplete="username"')
replace_in_file(login_path, 'errors.email', 'errors.username')
replace_in_file(login_path, "register('email')", "register('username')")
replace_in_file(login_path, 'email-error', 'username-error')
replace_in_file(login_path, 'Correo electrónico', 'Nombre de Usuario o ID')

users_api_path = 'C:/Users/gorti/Desktop/System-TI/apps/frontend/src/api/users.api.ts'
replace_in_file(users_api_path, "'email'", "'username'")

