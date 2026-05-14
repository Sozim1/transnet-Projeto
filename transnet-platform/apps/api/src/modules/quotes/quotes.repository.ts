import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class QuotesRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: Prisma.QuoteCreateInput) {
    return this.prisma.quote.create({
      data,
      include: { items: { include: { product: true } } },
    });
  }

  findMany() {
    return this.prisma.quote.findMany({
      orderBy: { createdAt: 'desc' },
      include: { items: { include: { product: true } } },
    });
  }

  findById(id: string) {
    return this.prisma.quote.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: {
              include: {
                category: true,
                brand: true,
                images: true,
              },
            },
          },
        },
      },
    });
  }
}
