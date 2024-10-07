import { ApiProperty } from '@nestjs/swagger'
import {
	IsBoolean,
	IsEnum,
	IsInt,
	IsNotEmpty,
	IsOptional
} from 'class-validator'

export enum RoleEnum {
	ADMIN = 'ADMIN',
	USER = 'USER',
	DEV = 'DEV',
	SUPER_ADMIN = 'SUPER_ADMIN',
	MANAGER = 'MANAGER',
	GHOST = 'GHOST'
}

export class CreateRoleDto {
	@ApiProperty({ example: 'USER', required: true })
	@IsEnum(RoleEnum)
	name: RoleEnum

	@ApiProperty({
		example: 'true'
	})
	@IsOptional()
	@IsBoolean()
	isActive: boolean
}

export class UpdateRoleDto extends CreateRoleDto {
	@ApiProperty({
		example: '1',
		required: true
	})
	@IsInt()
	@IsNotEmpty()
	id: number
}
