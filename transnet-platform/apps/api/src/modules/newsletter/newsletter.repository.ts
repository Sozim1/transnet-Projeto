import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class NewsletterRepository {
  constructor(private readonly prisma: PrismaService) {}

  upsert(data: Prisma.NewsletterSubscriberCreateInput) {
    return this.prisma.newsletterSubscriber.upsert({
      where: { email: data.email },
      update: { name: data.name, isActive: true },
      create: data,
    });
  }

  findMany() {
    return this.prisma.newsletterSubscriber.findMany({ orderBy: { createdAt: 'desc' } });
  }
}
