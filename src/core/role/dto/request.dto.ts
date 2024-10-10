import { ApiProperty, PartialType } from '@nestjs/swagger'
import { IsBoolean, IsNotEmpty, IsOptional } from 'class-validator'

export class CreateRoleDto {
	@ApiProperty({
		example: 'ADMIN',
		required: true,
		default: 'USER'
	})
	@IsNotEmpty()
	name: string

	@ApiProperty({
		example: true,
		required: false,
		default: true
	})
	@IsOptional()
	@IsBoolean()
	isActive: boolean = true
}

export class UpdateRoleDto extends PartialType(CreateRoleDto) {
	@ApiProperty({
		example: 1,
		required: true
	})
	@IsNotEmpty()
	id: number
}

export class RoleDtoForUser {
	id: number
}
