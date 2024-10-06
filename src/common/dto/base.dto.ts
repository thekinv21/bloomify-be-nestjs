import { Transform } from 'class-transformer'
import { IsNumber, IsOptional, IsString, Min } from 'class-validator'

export class BaseDto {
	@IsOptional()
	createdAt?: Date

	@IsOptional()
	updatedAt: Date
}

export class PaginationDto {
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

export type TypeNonPaginatedApiResponse<T> = {
	isSuccess: boolean
	status: number
	path: string
	message?: string | Array<{ errorMessage: string }>
	timestamp: string
	content: T
}

export type TypePaginatedApiResponse<T> = {
	isSuccess: boolean
	status: number
	path: string
	message?: string | Array<{ errorMessage: string }>
	timestamp: string
	total: number
	page: number
	pageSize: number
	isFirstPage: boolean
	isLastPage: boolean
	isEmpty: boolean
	totalPages: number
	content: T[]
}

export class PaginatedDto<T> {
	total: number
	content: T
}
