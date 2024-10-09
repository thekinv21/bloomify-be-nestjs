import { Transform } from 'class-transformer'
import { IsNumber, IsOptional, IsString, Min } from 'class-validator'

export class PaginationParams {
	@Transform(({ value }) => Number(value))
	@IsNumber()
	@Min(0)
	page: number

	@Transform(({ value }) => Number(value))
	@IsNumber()
	pageSize: number

	@IsOptional()
	@IsString()
	searchTerm?: string

	@IsOptional()
	@IsString()
	orderBy?: 'asc' | 'desc'
}

export class PaginationDto<T> {
	total: number
	content: T
}
