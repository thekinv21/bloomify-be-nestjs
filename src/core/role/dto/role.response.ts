import { Expose } from 'class-transformer'

export class RoleDto {
	@Expose()
	id: number

	@Expose()
	name: string

	@Expose()
	isActive: boolean

	@Expose()
	createdAt: Date | null

	@Expose()
	updatedAt: Date | null
}
