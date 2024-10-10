import { applyDecorators, UseGuards } from '@nestjs/common'
import { RoleGuard } from '../guards/admin.guard'
import { JwtAuthGuard } from '../guards/jwt.guard'

export const Auth = (roles: string[]) => {
	return applyDecorators(UseGuards(JwtAuthGuard, new RoleGuard(roles)))
}
