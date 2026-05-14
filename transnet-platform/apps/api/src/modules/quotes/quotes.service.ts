import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ProductsRepository } from '../products/products.repository';
import { CreateQuoteDto } from './dto/create-quote.dto';
import { QuotesRepository } from './quotes.repository';

@Injectable()
export class QuotesService {
  constructor(
    private readonly quotesRepository: QuotesRepository,
    private readonly productsRepository: ProductsRepository,
  ) {}

  async create(dto: CreateQuoteDto) {
    if (!dto.items.length) throw new BadRequestException('Cotacao precisa ter ao menos um produto');

    for (const item of dto.items) {
      const product = await this.productsRepository.findById(item.productId);
      if (!product) throw new BadRequestException(`Produto ${item.productId} nao encontrado`);
    }

    return this.quotesRepository.create({
      customerName: dto.customerName,
      company: dto.company,
      email: dto.email.toLowerCase(),
      phone: dto.phone,
      notes: dto.notes,
      items: {
        create: dto.items.map((item) => ({
          product: { connect: { id: item.productId } },
          quantity: item.quantity,
          notes: item.notes,
        })),
      },
    });
  }

  findAll() {
    return this.quotesRepository.findMany();
  }

  async findOne(id: string) {
    const quote = await this.quotesRepository.findById(id);
    if (!quote) throw new NotFoundException('Cotacao nao encontrada');
    return quote;
  }
}
