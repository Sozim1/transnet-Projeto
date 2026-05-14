import { PrismaClient, ProductStatus } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL ?? 'admin@transnet.local';
  const adminPassword = process.env.ADMIN_PASSWORD ?? 'Admin123!';

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      name: 'Administrador',
      email: adminEmail,
      passwordHash: await bcrypt.hash(adminPassword, 12),
      role: 'ADMIN',
    },
  });

  const categories = [
    { name: 'Redes', slug: 'redes', sortOrder: 1 },
    { name: 'Segurança eletrônica', slug: 'seguranca-eletronica', sortOrder: 2 },
    { name: 'Ferramentas', slug: 'ferramentas', sortOrder: 3 },
    { name: 'Elétrica', slug: 'eletrica', sortOrder: 4 },
    { name: 'Marcas', slug: 'marcas', sortOrder: 5 },
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: category,
      create: category,
    });
  }

  const brands = [
    'Control ID',
    'D-Link',
    'DC World',
    'Digifort',
    'Hikvision',
    'INET',
    'Lastmile',
    'Legrand',
    'Prysmian',
    'Seventh',
    'Siemon',
    'Transnet',
    'WOMER',
  ];

  for (const name of brands) {
    const slug = name
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    await prisma.brand.upsert({
      where: { slug },
      update: { name },
      create: { name, slug },
    });
  }

  const redes = await prisma.category.findUniqueOrThrow({ where: { slug: 'redes' } });
  const dcWorld = await prisma.brand.findUnique({ where: { slug: 'dc-world' } });
  const siemon = await prisma.brand.findUnique({ where: { slug: 'siemon' } });

  const productSeeds = [
    {
      name: 'Conversor de midia gigabit 10/100/1000M SM 20KM SC',
      slug: 'conversor-de-midia-gigabit-sm-20km-sc',
      brandId: dcWorld?.id,
      isFeatured: true,
    },
    {
      name: 'Keystone CAT.6 branco',
      slug: 'keystone-cat-6-branco',
      brandId: siemon?.id,
      isFeatured: true,
    },
  ];

  for (const product of productSeeds) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {
        name: product.name,
        brandId: product.brandId,
        isFeatured: product.isFeatured,
      },
      create: {
        name: product.name,
        slug: product.slug,
        categoryId: redes.id,
        brandId: product.brandId,
        shortDescription: 'Produto tecnico cadastrado como exemplo inicial.',
        description: 'Item de exemplo para validar o catalogo e o fluxo administrativo.',
        technicalSpecs: {
          origem: 'seed',
          observacao: 'Substituir por dados reais autorizados antes de publicar.',
        },
        isFeatured: product.isFeatured,
        status: ProductStatus.ACTIVE,
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
