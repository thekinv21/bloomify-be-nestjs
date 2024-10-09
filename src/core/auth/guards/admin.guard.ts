import {
	CanActivate,
	ExecutionContext,
	ForbiddenException,
	Injectable
} from '@nestjs/common'
import { Role, User } from '@prisma/client'
import { Request } from 'express'

@Injectable()
export class RoleGuard implements CanActivate {
	constructor(private requiredRole: Role) {}

	canActivate(context: ExecutionContext): boolean {
		const request = context.switchToHttp().getRequest<Request>()
		const user = request.user as User

		if (user.role !== this.requiredRole) {
			throw new ForbiddenException(
				`Sorry, but you aren't authorized for this action...`
			)
		}

		return true
	}
}
