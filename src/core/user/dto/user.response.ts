import { Exclude, Expose, Transform } from 'class-transformer'
import { UUID } from 'crypto'
import { IUser, IUserRole } from '../entities/user.entity'

export class UserDto {
	@Expose()
	id: UUID

	@Expose()
	firstName: string

	@Expose()
	lastName: string

	@Expose()
	email: string

	@Expose()
	username: string

	@Expose()
	isActive: boolean

	@Exclude()
	password: string

	@Expose()
	createdAt: Date | null

	@Expose()
	updatedAt: Date | null

	@Expose()
	@Transform(({ obj }: { obj: IUser }) =>
		obj.roles.map((item: IUserRole) => item.role.name)
	)
	roles: string[]
}
