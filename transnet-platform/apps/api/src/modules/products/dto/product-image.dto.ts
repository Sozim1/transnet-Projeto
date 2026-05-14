import { IsBoolean, IsInt, IsOptional, IsString, IsUrl, MaxLength } from 'class-validator';

export class ProductImageDto {
  @IsUrl({ require_tld: false })
  url: string;

  @IsOptional()
  @IsString()
  @MaxLength(160)
  alt?: string;

  @IsOptional()
  @IsInt()
  sortOrder?: number;

  @IsOptional()
  @IsBoolean()
  isMain?: boolean;
}
