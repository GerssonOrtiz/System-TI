import { PrismaClient, Role, TicketStatus, TicketPriority, TicketCategory, TaskStatus, TaskPriority } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed de la base de datos...');

  const adminUsername = process.env['SEED_ADMIN_USERNAME'] ?? 'admin';
  const adminPassword = process.env['SEED_ADMIN_PASSWORD'] ?? 'Admin1234!';

  // ─── Admin TI ──────────────────────────────────────────────────────────────
  const adminHash = await bcrypt.hash(adminPassword, 12);
  const admin = await prisma.user.upsert({
    where: { username: adminUsername },
    update: {},
    create: {
      fullName: 'Administrador TI',
      username: adminUsername,
      passwordHash: adminHash,
      role: Role.ADMIN_TI,
    },
  });
  console.log(`✅ Admin creado: ${admin.username}`);

  // ─── Usuarios Solicitantes de ejemplo ─────────────────────────────────────
  const solicitantes = [
    { fullName: 'María García', username: 'mgarcia' },
    { fullName: 'Carlos López', username: 'clopez' },
    { fullName: 'Ana Martínez', username: 'amartinez' },
  ];

  const createdUsers: Array<{ id: string; email: string }> = [];
  for (const s of solicitantes) {
    const hash = await bcrypt.hash('Solicitante1234!', 12);
    const user = await prisma.user.upsert({
      where: { username: s.username },
      update: {},
      create: {
        fullName: s.fullName,
        username: s.username,
        passwordHash: hash,
        role: Role.SOLICITANTE,
      },
    });
    createdUsers.push({ id: user.id, username: user.username });
    console.log(`✅ Solicitante creado: ${user.username}`);
  }

  // ─── Tickets de ejemplo ───────────────────────────────────────────────────
  const ticketsData = [
    {
      title: 'Mi equipo no enciende después de la actualización',
      description: 'Ayer se instaló una actualización de Windows y al día siguiente el equipo no arranca. Aparece pantalla azul con error INACCESSIBLE_BOOT_DEVICE.',
      status: TicketStatus.ABIERTO,
      priority: TicketPriority.ALTA,
      category: TicketCategory.HARDWARE,
      creatorUsername: 'mgarcia',
    },
    {
      title: 'No puedo acceder al sistema ERP',
      description: 'Desde esta mañana el sistema ERP me muestra error de credenciales aunque mi contraseña es correcta. He intentado restablecerla sin éxito.',
      status: TicketStatus.EN_PROGRESO,
      priority: TicketPriority.MEDIA,
      category: TicketCategory.ACCESOS,
      creatorUsername: 'clopez',
      assigneeUsername: adminUsername,
    },
    {
      title: 'La impresora del departamento de contabilidad no imprime en color',
      description: 'La impresora HP Color LaserJet solo imprime en blanco y negro. Se revisaron los cartuchos y están con tinta.',
      status: TicketStatus.RESUELTO,
      priority: TicketPriority.BAJA,
      category: TicketCategory.HARDWARE,
      creatorUsername: 'amartinez',
    },
    {
      title: 'Solicitud de acceso a carpeta compartida en servidor',
      description: 'Necesito acceso a la carpeta \\\\servidor\\proyectos\\2026 para poder colaborar con el equipo de proyectos especiales.',
      status: TicketStatus.ABIERTO,
      priority: TicketPriority.MEDIA,
      category: TicketCategory.ACCESOS,
      creatorUsername: 'mgarcia',
    },
  ];

  for (const t of ticketsData) {
    const creator = await prisma.user.findUnique({ where: { username: t.creatorUsername } });
    if (!creator) continue;

    const assignee = t.assigneeUsername
      ? await prisma.user.findUnique({ where: { username: t.assigneeUsername } })
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
        resolvedAt: t.status === TicketStatus.RESUELTO ? new Date() : null,
      },
    });
    console.log(`✅ Ticket creado: "${t.title.substring(0, 40)}..."`);
  }

  // ─── Tareas de ejemplo ────────────────────────────────────────────────────
  const tasksData = [
    {
      title: 'Actualizar inventario de equipos de cómputo',
      description: 'Realizar conteo físico y actualizar el registro de equipos en el sistema de inventario.',
      status: TaskStatus.PENDIENTE,
      priority: TaskPriority.MEDIA,
    },
    {
      title: 'Instalar parches de seguridad en servidores',
      description: 'Aplicar los parches del mes de agosto en los servidores de producción. Programar ventana de mantenimiento.',
      status: TaskStatus.EN_PROGRESO,
      priority: TaskPriority.ALTA,
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 días
    },
    {
      title: 'Configurar respaldos automáticos del servidor de archivos',
      description: 'Implementar política de respaldo diario con retención de 30 días usando rsync.',
      status: TaskStatus.COMPLETADA,
      priority: TaskPriority.ALTA,
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
  console.log(`   Admin TI:    ${adminUsername} / ${adminPassword}`);
  console.log(`   Solicitante: mgarcia / Solicitante1234!`);
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e);
    process.exit(1);
  })
  .finally(() => {
    void prisma.$disconnect();
  });
