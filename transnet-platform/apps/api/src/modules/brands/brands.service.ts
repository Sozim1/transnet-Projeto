import { Injectable, NotFoundException } from '@nestjs/common';
import { makeSlug } from '../../common/utils/slug';
import { BrandsRepository } from './brands.repository';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';

@Injectable()
export class BrandsService {
  constructor(private readonly brandsRepository: BrandsRepository) {}

  findAll() {
    return this.brandsRepository.findMany();
  }

  async findOne(slug: string) {
    const brand = await this.brandsRepository.findBySlug(slug);
    if (!brand) throw new NotFoundException('Marca nao encontrada');
    return brand;
  }

  create(dto: CreateBrandDto) {
    return this.brandsRepository.create({
      name: dto.name,
      slug: dto.slug ? makeSlug(dto.slug) : makeSlug(dto.name),
      description: dto.description,
      logoUrl: dto.logoUrl,
      isActive: dto.isActive,
    });
  }

  async update(id: string, dto: UpdateBrandDto) {
    await this.ensureExists(id);
    return this.brandsRepository.update(id, {
      name: dto.name,
      slug: dto.slug ? makeSlug(dto.slug) : dto.name ? makeSlug(dto.name) : undefined,
      description: dto.description,
      logoUrl: dto.logoUrl,
      isActive: dto.isActive,
    });
  }

  async remove(id: string) {
    await this.ensureExists(id);
    return this.brandsRepository.delete(id);
  }

  private async ensureExists(id: string) {
    const brand = await this.brandsRepository.findById(id);
    if (!brand) throw new NotFoundException('Marca nao encontrada');
    return brand;
  }
}
