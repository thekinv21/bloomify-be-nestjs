import { Exclude, Expose, Transform } from 'class-transformer'
import { UUID } from 'crypto'
import { IUser, IUserRole } from '../interface/user'

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
	createdAt: string | null

	@Expose()
	updatedAt: string | null

	@Expose()
	@Transform(({ obj }: { obj: IUser }) =>
		obj.roles.map((item: IUserRole) => item.role.name)
	)
	roles: string[]
}
