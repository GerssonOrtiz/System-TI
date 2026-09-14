"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('🌱 Iniciando seed de la base de datos...');
    const adminEmail = process.env['SEED_ADMIN_EMAIL'] ?? 'admin@empresa.com';
    const adminPassword = process.env['SEED_ADMIN_PASSWORD'] ?? 'Admin1234!';
    // ─── Admin TI ──────────────────────────────────────────────────────────────
    const adminHash = await bcryptjs_1.default.hash(adminPassword, 12);
    const admin = await prisma.user.upsert({
        where: { email: adminEmail },
        update: {},
        create: {
            fullName: 'Administrador TI',
            email: adminEmail,
            passwordHash: adminHash,
            role: client_1.Role.ADMIN_TI,
        },
    });
    console.log(`✅ Admin creado: ${admin.email}`);
    // ─── Usuarios Solicitantes de ejemplo ─────────────────────────────────────
    const solicitantes = [
        { fullName: 'María García', email: 'maria.garcia@empresa.com' },
        { fullName: 'Carlos López', email: 'carlos.lopez@empresa.com' },
        { fullName: 'Ana Martínez', email: 'ana.martinez@empresa.com' },
    ];
    const createdUsers = [];
    for (const s of solicitantes) {
        const hash = await bcryptjs_1.default.hash('Solicitante1234!', 12);
        const user = await prisma.user.upsert({
            where: { email: s.email },
            update: {},
            create: {
                fullName: s.fullName,
                email: s.email,
                passwordHash: hash,
                role: client_1.Role.SOLICITANTE,
            },
        });
        createdUsers.push({ id: user.id, email: user.email });
        console.log(`✅ Solicitante creado: ${user.email}`);
    }
    // ─── Tickets de ejemplo ───────────────────────────────────────────────────
    const ticketsData = [
        {
            title: 'Mi equipo no enciende después de la actualización',
            description: 'Ayer se instaló una actualización de Windows y al día siguiente el equipo no arranca. Aparece pantalla azul con error INACCESSIBLE_BOOT_DEVICE.',
            status: client_1.TicketStatus.ABIERTO,
            priority: client_1.TicketPriority.ALTA,
            category: client_1.TicketCategory.HARDWARE,
            creatorEmail: 'maria.garcia@empresa.com',
        },
        {
            title: 'No puedo acceder al sistema ERP',
            description: 'Desde esta mañana el sistema ERP me muestra error de credenciales aunque mi contraseña es correcta. He intentado restablecerla sin éxito.',
            status: client_1.TicketStatus.EN_PROGRESO,
            priority: client_1.TicketPriority.MEDIA,
            category: client_1.TicketCategory.ACCESOS,
            creatorEmail: 'carlos.lopez@empresa.com',
            assigneeEmail: adminEmail,
        },
        {
            title: 'La impresora del departamento de contabilidad no imprime en color',
            description: 'La impresora HP Color LaserJet solo imprime en blanco y negro. Se revisaron los cartuchos y están con tinta.',
            status: client_1.TicketStatus.RESUELTO,
            priority: client_1.TicketPriority.BAJA,
            category: client_1.TicketCategory.HARDWARE,
            creatorEmail: 'ana.martinez@empresa.com',
        },
        {
            title: 'Solicitud de acceso a carpeta compartida en servidor',
            description: 'Necesito acceso a la carpeta \\\\servidor\\proyectos\\2026 para poder colaborar con el equipo de proyectos especiales.',
            status: client_1.TicketStatus.ABIERTO,
            priority: client_1.TicketPriority.MEDIA,
            category: client_1.TicketCategory.ACCESOS,
            creatorEmail: 'maria.garcia@empresa.com',
        },
    ];
    for (const t of ticketsData) {
        const creator = await prisma.user.findUnique({ where: { email: t.creatorEmail } });
        if (!creator)
            continue;
        const assignee = t.assigneeEmail
            ? await prisma.user.findUnique({ where: { email: t.assigneeEmail } })
            : null;
        await prisma.ticket.create({
            data: {
                title: t.title,
                description: t.description,
                status: t.status,
                priority: t.priority,
                category: t.category,
                creatorId: creator.id,
                assigneeId: assignee?.id ?? null,
                resolvedAt: t.status === client_1.TicketStatus.RESUELTO ? new Date() : null,
            },
        });
        console.log(`✅ Ticket creado: "${t.title.substring(0, 40)}..."`);
    }
    // ─── Tareas de ejemplo ────────────────────────────────────────────────────
    const tasksData = [
        {
            title: 'Actualizar inventario de equipos de cómputo',
            description: 'Realizar conteo físico y actualizar el registro de equipos en el sistema de inventario.',
            status: client_1.TaskStatus.PENDIENTE,
            priority: client_1.TaskPriority.MEDIA,
        },
        {
            title: 'Instalar parches de seguridad en servidores',
            description: 'Aplicar los parches del mes de agosto en los servidores de producción. Programar ventana de mantenimiento.',
            status: client_1.TaskStatus.EN_PROGRESO,
            priority: client_1.TaskPriority.ALTA,
            dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 días
        },
        {
            title: 'Configurar respaldos automáticos del servidor de archivos',
            description: 'Implementar política de respaldo diario con retención de 30 días usando rsync.',
            status: client_1.TaskStatus.COMPLETADA,
            priority: client_1.TaskPriority.ALTA,
        },
    ];
    for (const t of tasksData) {
        await prisma.task.create({
            data: {
                title: t.title,
                description: t.description,
                status: t.status,
                priority: t.priority,
                dueDate: t.dueDate ?? null,
                creatorId: admin.id,
            },
        });
        console.log(`✅ Tarea creada: "${t.title.substring(0, 40)}..."`);
    }
    // ─── Artículos de Base de Conocimiento de ejemplo ─────────────────────────
    const kbArticles = [
        {
            title: 'Cómo solicitar acceso a sistemas corporativos',
            slug: 'como-solicitar-acceso-sistemas-corporativos',
            category: 'Accesos',
            tags: ['accesos', 'sistemas', 'nuevo-empleado'],
            isPublished: true,
            content: `# Cómo solicitar acceso a sistemas corporativos

## Descripción
Este artículo explica el proceso para solicitar acceso a los diferentes sistemas de la empresa.

## Pasos

1. **Ingresa al portal de TI** en http://portal-ti.empresa.com
2. **Crea un ticket** con categoría "Accesos"
3. Especifica en la descripción:
   - El sistema al que necesitas acceso
   - El motivo del acceso
   - El nivel de permisos requerido (lectura / escritura)
4. **Adjunta la autorización** de tu jefe directo (correo o memorándum)

## Tiempos de respuesta

| Tipo de acceso | Tiempo estimado |
|---|---|
| Sistemas internos | 1-2 días hábiles |
| VPN | 2-3 días hábiles |
| Sistemas externos | 5-7 días hábiles |

## Contacto
Para dudas: soporte.ti@empresa.com`,
        },
        {
            title: 'Solución de problemas comunes con la VPN',
            slug: 'solucion-problemas-vpn',
            category: 'Red',
            tags: ['vpn', 'red', 'conectividad', 'trabajo-remoto'],
            isPublished: true,
            content: `# Solución de problemas comunes con la VPN

## Error: "No se puede conectar al servidor VPN"

### Causa común
El servicio de VPN no está corriendo o hay un problema con las credenciales.

### Solución

1. Verifica que tienes conexión a internet
2. Reinicia el cliente VPN:
   - Windows: Busca "GlobalProtect" en la bandeja del sistema → Desconectar → Reconectar
3. Si persiste, reinicia el equipo
4. Verifica que tu contraseña no ha expirado en: https://cuenta.empresa.com

## Error: "Credenciales incorrectas"

Tu contraseña corporativa puede haber expirado. Actualízala en el portal de cuentas antes de intentar conectarte.

## ¿Sigues sin poder conectarte?

Crea un ticket con categoría "Red" y adjunta una captura de pantalla del error.`,
        },
    ];
    for (const a of kbArticles) {
        await prisma.knowledgeArticle.create({
            data: {
                title: a.title,
                slug: a.slug,
                content: a.content,
                category: a.category,
                tags: a.tags,
                isPublished: a.isPublished,
                authorId: admin.id,
            },
        });
        console.log(`✅ Artículo creado: "${a.title}"`);
    }
    console.log('\n🎉 Seed completado exitosamente');
    console.log(`\n📋 Credenciales de prueba:`);
    console.log(`   Admin TI:    ${adminEmail} / ${adminPassword}`);
    console.log(`   Solicitante: maria.garcia@empresa.com / Solicitante1234!`);
}
main()
    .catch((e) => {
    console.error('❌ Error en seed:', e);
    process.exit(1);
})
    .finally(() => {
    void prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map