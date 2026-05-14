import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { makeSlug } from '../../common/utils/slug';
import { CategoriesRepository } from './categories.repository';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private readonly categoriesRepository: CategoriesRepository) {}

  findAll() {
    return this.categoriesRepository.findMany();
  }

  findTree() {
    return this.categoriesRepository.findTree();
  }

  async findOne(slug: string) {
    const category = await this.categoriesRepository.findBySlug(slug);
    if (!category) throw new NotFoundException('Categoria nao encontrada');
    return category;
  }

  async create(dto: CreateCategoryDto) {
    if (dto.parentId) await this.ensureParent(dto.parentId);

    return this.categoriesRepository.create({
      name: dto.name,
      slug: dto.slug ? makeSlug(dto.slug) : makeSlug(dto.name),
      description: dto.description,
      parent: dto.parentId ? { connect: { id: dto.parentId } } : undefined,
      isActive: dto.isActive,
      sortOrder: dto.sortOrder,
    });
  }

  async update(id: string, dto: UpdateCategoryDto) {
    await this.ensureExists(id);
    if (dto.parentId) {
      if (dto.parentId === id) throw new BadRequestException('Categoria nao pode ser pai dela mesma');
      await this.ensureParent(dto.parentId);
    }

    return this.categoriesRepository.update(id, {
      name: dto.name,
      slug: dto.slug ? makeSlug(dto.slug) : dto.name ? makeSlug(dto.name) : undefined,
      description: dto.description,
      parent:
        dto.parentId === null
          ? { disconnect: true }
          : dto.parentId
            ? { connect: { id: dto.parentId } }
            : undefined,
      isActive: dto.isActive,
      sortOrder: dto.sortOrder,
    });
  }

  async remove(id: string) {
    await this.ensureExists(id);
    return this.categoriesRepository.delete(id);
  }

  private async ensureExists(id: string) {
    const category = await this.categoriesRepository.findById(id);
    if (!category) throw new NotFoundException('Categoria nao encontrada');
    return category;
  }

  private async ensureParent(id: string) {
    const parent = await this.categoriesRepository.findById(id);
    if (!parent) throw new BadRequestException('Categoria pai nao encontrada');
    return parent;
  }
}
