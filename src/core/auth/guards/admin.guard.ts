import { PrismaService } from '@/root/prisma'
import {
	BadRequestException,
	CanActivate,
	ExecutionContext,
	ForbiddenException,
	Injectable,
	NotFoundException
} from '@nestjs/common'
import { User } from '@prisma/client'
import { Request } from 'express'

@Injectable()
export class RoleGuard implements CanActivate {
	constructor(private readonly roles: string[]) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest<Request>()
		const requestedUser = request.user as User

		if (!requestedUser) {
			throw new BadRequestException('Requested User Object is not found!')
		}

		const prisma = new PrismaService()

		const user = await prisma.user.findUnique({
			where: {
				id: requestedUser.id
			},
			include: {
				roles: {
					include: {
						role: true
					}
				}
			}
		})

		if (!user) {
			throw new NotFoundException('User is not founded!')
		}

		if (user && !user.roles.some(item => this.roles.includes(item.role.name))) {
			throw new ForbiddenException(
				"Sorry, but you aren't authorized for this action..."
			)
		}

		return true
	}
}
