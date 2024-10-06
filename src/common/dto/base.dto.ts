import { Transform } from 'class-transformer'
import { IsNumber, IsOptional, IsString, Min } from 'class-validator'

export class BaseDto {
	@IsOptional()
	createdAt?: Date

	@IsOptional()
	updatedAt: Date
}

export class PaginationDto {
	@IsOptional()
	@Transform(({ value }) => Number(value))
	@IsNumber()
	@Min(0)
	page?: number

	@IsOptional()
	@Transform(({ value }) => Number(value))
	@IsNumber()
	@Min(10)
	pageSize?: number

	@IsOptional()
	@IsString()
	searchTerm?: string

	@IsOptional()
	@IsString()
	orderBy?: 'asc' | 'desc'
}
