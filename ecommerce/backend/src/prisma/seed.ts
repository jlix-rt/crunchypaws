import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed de la base de datos...');

  // Limpiar datos existentes
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.userAddress.deleteMany();
  await prisma.user.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.coupon.deleteMany();
  await prisma.paymentMethod.deleteMany();
  await prisma.contactMessage.deleteMany();
  await prisma.config.deleteMany();

  // Crear categorías principales
  const perroCategory = await prisma.category.create({
    data: {
      name: 'Perro',
      slug: 'perro',
    },
  });

  const gatoCategory = await prisma.category.create({
    data: {
      name: 'Gato',
      slug: 'gato',
    },
  });

  // Crear subcategorías para perros
  const perroSnacksCategory = await prisma.category.create({
    data: {
      name: 'Snacks',
      slug: 'perro-snacks',
      parentId: perroCategory.id,
    },
  });

  const perroTratamientosCategory = await prisma.category.create({
    data: {
      name: 'Tratamientos',
      slug: 'perro-tratamientos',
      parentId: perroCategory.id,
    },
  });

  // Crear subcategorías para gatos
  const gatoSnacksCategory = await prisma.category.create({
    data: {
      name: 'Snacks',
      slug: 'gato-snacks',
      parentId: gatoCategory.id,
    },
  });

  const gatoTratamientosCategory = await prisma.category.create({
    data: {
      name: 'Tratamientos',
      slug: 'gato-tratamientos',
      parentId: gatoCategory.id,
    },
  });

  // Crear productos para perros
  const perroProducts = [
    {
      name: 'Patitas de Pollo Deshidratadas',
      slug: 'patitas-pollo-deshidratadas',
      description: 'Deliciosas patitas de pollo 100% naturales, deshidratadas sin conservantes. Perfectas para premiar a tu perro.',
      price: 25.50,
      imageUrl: '/assets/images/products/patitas-pollo.jpg',
      stock: 50,
      isFeatured: true,
      categoryId: perroSnacksCategory.id,
    },
    {
      name: 'Tráqueas de Res Deshidratadas',
      slug: 'traqueas-res-deshidratadas',
      description: 'Tráqueas de res naturales, ricas en condroitina y glucosamina. Excelentes para la salud articular.',
      price: 35.00,
      imageUrl: '/assets/images/products/traqueas-res.jpg',
      stock: 30,
      isFeatured: true,
      categoryId: perroSnacksCategory.id,
    },
    {
      name: 'Orejas de Cerdo Deshidratadas',
      slug: 'orejas-cerdo-deshidratadas',
      description: 'Orejas de cerdo completamente naturales. Un snack crujiente que ayuda a mantener los dientes limpios.',
      price: 18.75,
      imageUrl: '/assets/images/products/orejas-cerdo.jpg',
      stock: 40,
      isFeatured: false,
      categoryId: perroSnacksCategory.id,
    },
    {
      name: 'Pulmón de Res Deshidratado',
      slug: 'pulmon-res-deshidratado',
      description: 'Pulmón de res bajo en grasa y alto en proteína. Ideal para perros con dietas especiales.',
      price: 22.00,
      imageUrl: '/assets/images/products/pulmon-res.jpg',
      stock: 25,
      isFeatured: false,
      categoryId: perroTratamientosCategory.id,
    },
    {
      name: 'Hígado de Pollo Deshidratado',
      slug: 'higado-pollo-deshidratado',
      description: 'Hígado de pollo rico en vitaminas A y B. Perfecto para entrenamientos y como premio especial.',
      price: 28.50,
      imageUrl: '/assets/images/products/higado-pollo.jpg',
      stock: 35,
      isFeatured: true,
      categoryId: perroTratamientosCategory.id,
    },
  ];

  // Crear productos para gatos
  const gatoProducts = [
    {
      name: 'Pescado Deshidratado para Gatos',
      slug: 'pescado-deshidratado-gatos',
      description: 'Delicioso pescado deshidratado, rico en omega 3. Irresistible para los felinos más exigentes.',
      price: 32.00,
      imageUrl: '/assets/images/products/pescado-gatos.jpg',
      stock: 20,
      isFeatured: true,
      categoryId: gatoSnacksCategory.id,
    },
    {
      name: 'Pollo Deshidratado para Gatos',
      slug: 'pollo-deshidratado-gatos',
      description: 'Trozos de pollo deshidratado, 100% natural. Alto contenido proteico para gatos activos.',
      price: 26.75,
      imageUrl: '/assets/images/products/pollo-gatos.jpg',
      stock: 30,
      isFeatured: false,
      categoryId: gatoSnacksCategory.id,
    },
    {
      name: 'Hígado de Pollo para Gatos',
      slug: 'higado-pollo-gatos',
      description: 'Hígado de pollo deshidratado especialmente procesado para gatos. Rico en taurina.',
      price: 29.25,
      imageUrl: '/assets/images/products/higado-gatos.jpg',
      stock: 15,
      isFeatured: true,
      categoryId: gatoTratamientosCategory.id,
    },
  ];

  // Insertar productos
  for (const product of [...perroProducts, ...gatoProducts]) {
    await prisma.product.create({ data: product });
  }

  // Crear cupones
  await prisma.coupon.createMany({
    data: [
      {
        code: 'BIENVENIDO10',
        type: 'PERCENTAGE',
        value: 10,
        minSubtotal: 50,
        expiresAt: new Date('2025-12-31'),
        isActive: true,
      },
      {
        code: 'ENVIOGRATIS',
        type: 'FIXED',
        value: 15,
        minSubtotal: 100,
        expiresAt: new Date('2025-06-30'),
        isActive: true,
      },
      {
        code: 'PRIMERACOMPRA',
        type: 'PERCENTAGE',
        value: 15,
        minSubtotal: 75,
        expiresAt: null,
        isActive: true,
      },
    ],
  });

  // Crear métodos de pago
  await prisma.paymentMethod.createMany({
    data: [
      {
        key: 'CARD',
        label: 'Tarjeta de Crédito/Débito',
        enabled: true,
        meta: {
          description: 'Pago seguro con tarjeta',
          processingTime: 'Inmediato',
          fees: 'Sin costo adicional',
        },
      },
      {
        key: 'CASH',
        label: 'Efectivo contra entrega',
        enabled: true,
        meta: {
          description: 'Paga en efectivo al recibir tu pedido',
          processingTime: '24-48 horas',
          fees: 'Sin costo adicional',
        },
      },
      {
        key: 'TRANSFER',
        label: 'Transferencia Bancaria',
        enabled: true,
        meta: {
          description: 'Transferencia a cuenta bancaria',
          processingTime: '1-2 días hábiles',
          fees: 'Sin costo adicional',
          bankInfo: {
            bank: 'Banco Industrial',
            account: '123-456789-0',
            name: 'CrunchyPaws S.A.',
          },
        },
      },
    ],
  });

  // Crear usuario demo
  const hashedPassword = await bcrypt.hash('password123', 10);
  const demoUser = await prisma.user.create({
    data: {
      nombre: 'Juan Carlos',
      apellido: 'Pérez López',
      email: 'demo@crunchypaws.com',
      telefono: '+50212345678',
      nit: '12345678-9',
      passwordHash: hashedPassword,
    },
  });

  // Crear direcciones para el usuario demo
  await prisma.userAddress.createMany({
    data: [
      {
        userId: demoUser.id,
        alias: 'Casa',
        line1: '5ta Avenida 12-34, Zona 10',
        line2: 'Edificio Torre Azul, Apartamento 15A',
        municipio: 'Guatemala',
        departamento: 'Guatemala',
        codigoPostal: '01010',
        referencia: 'Frente al Centro Comercial Oakland Mall',
        esPredeterminada: true,
      },
      {
        userId: demoUser.id,
        alias: 'Oficina',
        line1: '12 Calle 1-25, Zona 1',
        line2: null,
        municipio: 'Guatemala',
        departamento: 'Guatemala',
        codigoPostal: '01001',
        referencia: 'Edificio de oficinas, segundo piso',
        esPredeterminada: false,
      },
    ],
  });

  // Crear configuración de WhatsApp
  await prisma.config.create({
    data: {
      scope: 'whatsapp',
      key: 'settings',
      value: {
        enabled: true,
        provider: 'mock',
        from: '+50200000000',
        to: '+50200000000',
        token: 'mock-token',
        namespace: 'crunchypaws',
      },
    },
  });

  // Crear algunos mensajes de contacto demo
  await prisma.contactMessage.createMany({
    data: [
      {
        name: 'María González',
        email: 'maria@example.com',
        message: '¿Tienen productos para cachorros de 2 meses?',
      },
      {
        name: 'Carlos Rodríguez',
        email: 'carlos@example.com',
        message: 'Me gustaría saber sobre los beneficios de los productos deshidratados.',
      },
    ],
  });

  console.log('✅ Seed completado exitosamente!');
  console.log('📧 Usuario demo: demo@crunchypaws.com');
  console.log('🔑 Contraseña: password123');
}

main()
  .catch((e) => {
    console.error('❌ Error en el seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
