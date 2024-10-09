import { Prisma } from '@prisma/client'

export function buildSearchBy<T extends string>(
	searchTerm?: string,
	fields?: T[]
) {
	const condition = fields?.map((field: string | number) => ({
		[field]: { contains: searchTerm, mode: 'insensitive' }
	}))

	return {
		isActive: true,
		...(searchTerm && condition?.length ? { OR: condition } : {})
	}
}

export function buildOrderBy(orderBy?: string, direction?: 'asc' | 'desc') {
	return orderBy
		? {
				[orderBy]: direction as Prisma.SortOrder
			}
		: { updatedAt: 'desc' as Prisma.SortOrder }
}
