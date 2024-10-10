import { IBaseType } from '@/base'

export interface IRole extends IBaseType {
	id: number
	name: string
	isActive: boolean
}
