import { JwtAuthService } from '@/core/auth/jwt/jwt.service'
import {
	CanActivate,
	ExecutionContext,
	Injectable,
	UnauthorizedException
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { Request } from 'express'

@Injectable()
export class AuthGuard implements CanActivate {
	constructor(
		private jwt: JwtService,
		private envConfig: ConfigService,
		private jwtAuth: JwtAuthService
	) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest()
		const token = this.extractAccessToken(request)
		if (!token) {
			throw new UnauthorizedException("Oops! You're not authorized...")
		}

		try {
			if (token) {
				await this.jwtAuth.verifyToken(token)
			}

			const payload = await this.jwt.verifyAsync(token, {
				secret: this.envConfig.get('JWT_SECRET')
			})
			request['user'] = payload
		} catch {
			throw new UnauthorizedException("Oops! You're not authorized...")
		}
		return true
	}

	private extractAccessToken(request: Request): string | undefined {
		const [type, token] = request.headers.authorization?.split(' ') ?? []
		return type === 'Bearer' ? token : undefined
	}
}
