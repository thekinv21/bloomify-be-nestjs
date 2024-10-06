import { Exclude, Expose } from 'class-transformer'

export class UserDto {
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
}
