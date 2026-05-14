import { Module } from '@nestjs/common';
import { ProductsRepository } from '../products/products.repository';
import { QuotesController } from './quotes.controller';
import { QuotesRepository } from './quotes.repository';
import { QuotesService } from './quotes.service';

@Module({
  controllers: [QuotesController],
  providers: [QuotesService, QuotesRepository, ProductsRepository],
})
export class QuotesModule {}
