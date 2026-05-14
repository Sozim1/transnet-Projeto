import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ProductsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findMany(args: {
    where: Prisma.ProductWhereInput;
    page: number;
    limit: number;
  }) {
    const skip = (args.page - 1) * args.limit;
    const [items, total] = await this.prisma.$transaction([
      this.prisma.product.findMany({
        where: args.where,
        skip,
        take: args.limit,
        orderBy: { createdAt: 'desc' },
        include: this.defaultInclude(),
      }),
      this.prisma.product.count({ where: args.where }),
    ]);

    return {
      items,
      meta: {
        total,
        page: args.page,
        limit: args.limit,
        pageCount: Math.ceil(total / args.limit),
      },
    };
  }

  findFeatured(limit = 8) {
    return this.prisma.product.findMany({
      where: { isFeatured: true, status: 'ACTIVE' },
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: this.defaultInclude(),
    });
  }

  findById(id: string) {
    return this.prisma.product.findUnique({
      where: { id },
      include: this.defaultInclude(),
    });
  }

  findBySlug(slug: string) {
    return this.prisma.product.findUnique({
      where: { slug },
      include: this.defaultInclude(),
    });
  }

  create(data: Prisma.ProductCreateInput) {
    return this.prisma.product.create({
      data,
      include: this.defaultInclude(),
    });
  }

  update(id: string, data: Prisma.ProductUpdateInput) {
    return this.prisma.product.update({
      where: { id },
      data,
      include: this.defaultInclude(),
    });
  }

  delete(id: string) {
    return this.prisma.product.delete({
      where: { id },
      include: this.defaultInclude(),
    });
  }

  createImage(productId: string, data: Prisma.ProductImageCreateWithoutProductInput) {
    return this.prisma.productImage.create({
      data: {
        ...data,
        product: { connect: { id: productId } },
      },
    });
  }

  deleteImage(productId: string, imageId: string) {
    return this.prisma.productImage.deleteMany({
      where: {
        id: imageId,
        productId,
      },
    });
  }

  private defaultInclude() {
    return {
      category: true,
      brand: true,
      images: {
        orderBy: [{ isMain: 'desc' }, { sortOrder: 'asc' }, { createdAt: 'asc' }],
      },
    } satisfies Prisma.ProductInclude;
  }
}
