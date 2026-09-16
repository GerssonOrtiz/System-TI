const fs = require('fs');

const seedPath = 'C:/Users/gorti/Desktop/System-TI/apps/backend/prisma/seed.ts';
let content = fs.readFileSync(seedPath, 'utf8');

content = content.replace(/adminEmail/g, 'adminUsername');
content = content.replace(/process\.env\['SEED_ADMIN_EMAIL'\] \?\? 'admin@empresa\.com'/g, "process.env['SEED_ADMIN_USERNAME'] ?? 'admin'");
content = content.replace(/email: adminUsername/g, 'username: adminUsername');
content = content.replace(/\$\{admin\.email\}/g, '${admin.username}');

content = content.replace(/email: 'maria.garcia@empresa.com'/g, "username: 'mgarcia'");
content = content.replace(/email: 'carlos.lopez@empresa.com'/g, "username: 'clopez'");
content = content.replace(/email: 'ana.martinez@empresa.com'/g, "username: 'amartinez'");

content = content.replace(/email: s\.email/g, 'username: s.username');
content = content.replace(/\$\{user\.email\}/g, '${user.username}');
content = content.replace(/email: user\.email/g, 'username: user.username');

content = content.replace(/creatorEmail/g, 'creatorUsername');
content = content.replace(/assigneeEmail/g, 'assigneeUsername');
content = content.replace(/'maria\.garcia@empresa\.com'/g, "'mgarcia'");
content = content.replace(/'carlos\.lopez@empresa\.com'/g, "'clopez'");
content = content.replace(/'ana\.martinez@empresa\.com'/g, "'amartinez'");

content = content.replace(/email: t\.creatorUsername/g, 'username: t.creatorUsername');
content = content.replace(/email: t\.assigneeUsername/g, 'username: t.assigneeUsername');

content = content.replace(/\$\{adminEmail\}/g, '${adminUsername}');
content = content.replace(/maria\.garcia@empresa\.com/g, 'mgarcia');

fs.writeFileSync(seedPath, content);
console.log('seed.ts updated');
