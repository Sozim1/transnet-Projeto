import { Injectable } from '@nestjs/common';
import { CreateNewsletterDto } from './dto/create-newsletter.dto';
import { NewsletterRepository } from './newsletter.repository';

@Injectable()
export class NewsletterService {
  constructor(private readonly newsletterRepository: NewsletterRepository) {}

  subscribe(dto: CreateNewsletterDto) {
    return this.newsletterRepository.upsert({
      email: dto.email.toLowerCase(),
      name: dto.name,
    });
  }

  findAll() {
    return this.newsletterRepository.findMany();
  }
}
