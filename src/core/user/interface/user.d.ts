import { IBaseType } from '@/base'
import { IRole } from '../../role/interface/role'

export interface IUser extends IBaseType {
	id: string
	name: string
	firstName: string
	lastName: string
	username: string
	email: string
	password: string
	isActive: boolean
	roles: IUserRole[]
}

export interface IUserRole {
	id: number
	userId: string
	roleId: number
	role: IRole
}
