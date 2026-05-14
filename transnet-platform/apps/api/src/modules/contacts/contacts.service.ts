import { Injectable } from '@nestjs/common';
import { CreateContactDto } from './dto/create-contact.dto';
import { ContactsRepository } from './contacts.repository';

@Injectable()
export class ContactsService {
  constructor(private readonly contactsRepository: ContactsRepository) {}

  create(dto: CreateContactDto) {
    return this.contactsRepository.create(dto);
  }

  findAll() {
    return this.contactsRepository.findMany();
  }
}
