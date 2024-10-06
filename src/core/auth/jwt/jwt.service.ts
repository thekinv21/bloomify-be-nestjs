import { Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { UUID } from 'crypto'

import { PrismaService } from '@/root/prisma/prisma.service'
import { TokenResponse } from '../dto/auth.response'

@Injectable()
export class JwtAuthService {
	constructor(
		private readonly envConfig: ConfigService,
		private readonly jwt: JwtService,
		private readonly prismaService: PrismaService
	) {}

	async generateTokens(userId: UUID) {
		const accessToken = this.jwt.sign(
			{ id: userId },
			{
				expiresIn: this.envConfig.get('JWT_EXPIRED'),
				secret: this.envConfig.get('JWT_SECRET')
			}
		)

		const refreshToken = this.jwt.sign(
			{ id: userId },
			{
				expiresIn: this.envConfig.get('JWT_REFRESH_EXPIRED'),
				secret: this.envConfig.get('JWT_SECRET')
			}
		)

		const expiryDate = this.jwt?.decode(accessToken)?.exp
			? new Date(this.jwt.decode(accessToken)?.exp * 1000).toISOString()
			: null

		const token: TokenResponse = {
			accessToken,
			refreshToken,
			expiryDate: expiryDate as string
		}

		return token
	}

	async addToBlacklist(token: string): Promise<void> {
		await this.prismaService.token.create({
			data: {
				token: token,
				isActive: false
			}
		})
	}

	async isTokenBlacklisted(token: string): Promise<boolean> {
		const invalidToken = await this.prismaService.token.findUnique({
			where: { token: token, isActive: false }
		})
		return !!invalidToken
	}

	async verifyToken(accessToken: string) {
		const isBlacklisted = await this.isTokenBlacklisted(accessToken)

		if (isBlacklisted) {
			throw new UnauthorizedException('Token is expired or Invalid!')
		}

		const decodedAccessToken = await this.jwt.decode(accessToken)

		if (!decodedAccessToken) {
			throw new UnauthorizedException('Token is Invalid!')
		}

		const currentTime = Math.floor(Date.now() / 1000)
		const tokenTime = decodedAccessToken?.exp

		if (tokenTime && currentTime > tokenTime) {
			await this.addToBlacklist(accessToken)
			throw new UnauthorizedException('Access Token is expired!')
		}

		return decodedAccessToken
	}
}
