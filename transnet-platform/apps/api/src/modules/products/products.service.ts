import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { makeSlug } from '../../common/utils/slug';
import { BrandsRepository } from '../brands/brands.repository';
import { CategoriesRepository } from '../categories/categories.repository';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductImageDto } from './dto/product-image.dto';
import { QueryProductsDto } from './dto/query-products.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsRepository } from './products.repository';

@Injectable()
export class ProductsService {
  constructor(
    private readonly productsRepository: ProductsRepository,
    private readonly categoriesRepository: CategoriesRepository,
    private readonly brandsRepository: BrandsRepository,
  ) {}

  findAll(query: QueryProductsDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 12;
    const where: Prisma.ProductWhereInput = {};

    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { sku: { contains: query.search, mode: 'insensitive' } },
        { shortDescription: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    if (query.categoryId) where.categoryId = query.categoryId;
    if (query.categorySlug) where.category = { slug: query.categorySlug };
    if (query.brandId) where.brandId = query.brandId;
    if (query.brandSlug) where.brand = { slug: query.brandSlug };

    return this.productsRepository.findMany({ where, page, limit });
  }

  findFeatured() {
    return this.productsRepository.findFeatured();
  }

  async findOne(slug: string) {
    const product = await this.productsRepository.findBySlug(slug);
    if (!product) throw new NotFoundException('Produto nao encontrado');
    return product;
  }

  async create(dto: CreateProductDto) {
    await this.ensureCategory(dto.categoryId);
    if (dto.brandId) await this.ensureBrand(dto.brandId);

    return this.productsRepository.create({
      name: dto.name,
      slug: dto.slug ? makeSlug(dto.slug) : makeSlug(dto.name),
      sku: dto.sku,
      shortDescription: dto.shortDescription,
      description: dto.description,
      technicalSpecs: dto.technicalSpecs as Prisma.InputJsonValue,
      category: { connect: { id: dto.categoryId } },
      brand: dto.brandId ? { connect: { id: dto.brandId } } : undefined,
      isFeatured: dto.isFeatured,
      status: dto.status,
      images: dto.images?.length
        ? {
            create: this.normalizeImages(dto.images),
          }
        : undefined,
    });
  }

  async update(id: string, dto: UpdateProductDto) {
    await this.ensureProduct(id);
    if (dto.categoryId) await this.ensureCategory(dto.categoryId);
    if (dto.brandId) await this.ensureBrand(dto.brandId);

    return this.productsRepository.update(id, {
      name: dto.name,
      slug: dto.slug ? makeSlug(dto.slug) : dto.name ? makeSlug(dto.name) : undefined,
      sku: dto.sku,
      shortDescription: dto.shortDescription,
      description: dto.description,
      technicalSpecs: dto.technicalSpecs as Prisma.InputJsonValue,
      category: dto.categoryId ? { connect: { id: dto.categoryId } } : undefined,
      brand:
        dto.brandId === null
          ? { disconnect: true }
          : dto.brandId
            ? { connect: { id: dto.brandId } }
            : undefined,
      isFeatured: dto.isFeatured,
      status: dto.status,
      images: dto.images
        ? {
            deleteMany: {},
            create: this.normalizeImages(dto.images),
          }
        : undefined,
    });
  }

  async remove(id: string) {
    await this.ensureProduct(id);
    return this.productsRepository.delete(id);
  }

  async addImage(productId: string, dto: ProductImageDto) {
    await this.ensureProduct(productId);
    return this.productsRepository.createImage(productId, dto);
  }

  async removeImage(productId: string, imageId: string) {
    await this.ensureProduct(productId);
    return this.productsRepository.deleteImage(productId, imageId);
  }

  private normalizeImages(images: ProductImageDto[]) {
    const mainCount = images.filter((image) => image.isMain).length;
    if (mainCount > 1) throw new BadRequestException('Apenas uma imagem principal e permitida');

    return images.map((image, index) => ({
      url: image.url,
      alt: image.alt,
      sortOrder: image.sortOrder ?? index,
      isMain: image.isMain ?? index === 0,
    }));
  }

  private async ensureProduct(id: string) {
    const product = await this.productsRepository.findById(id);
    if (!product) throw new NotFoundException('Produto nao encontrado');
    return product;
  }

  private async ensureCategory(id: string) {
    const category = await this.categoriesRepository.findById(id);
    if (!category) throw new BadRequestException('Categoria nao encontrada');
    return category;
  }

  private async ensureBrand(id: string) {
    const brand = await this.brandsRepository.findById(id);
    if (!brand) throw new BadRequestException('Marca nao encontrada');
    return brand;
  }
}
