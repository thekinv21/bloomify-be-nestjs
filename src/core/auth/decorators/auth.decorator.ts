import { applyDecorators, UseGuards } from '@nestjs/common'
import { Role } from '@prisma/client'

import { RoleGuard } from '../guards/admin.guard'
import { JwtAuthGuard } from '../guards/jwt.guard'

export const Auth = (role: Role = Role.USER) => {
	return applyDecorators(UseGuards(JwtAuthGuard, new RoleGuard(role)))
}
