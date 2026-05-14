import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ContactsRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: Prisma.ContactCreateInput) {
    return this.prisma.contact.create({ data });
  }

  findMany() {
    return this.prisma.contact.findMany({ orderBy: { createdAt: 'desc' } });
  }
}
