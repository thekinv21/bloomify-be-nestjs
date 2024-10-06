import {
	BadRequestException,
	Injectable,
	UnauthorizedException
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { UUID } from 'crypto'

import { PrismaService } from '@/root/prisma/prisma.service'
import { UserService } from '../../user/user.service'
import { RefreshTokenDto } from '../dto/auth.request'
import { TokenResponse } from '../dto/auth.response'

@Injectable()
export class JwtAuthService {
	constructor(
		private readonly envConfig: ConfigService,
		private readonly jwt: JwtService,
		private readonly prismaService: PrismaService,
		private readonly userService: UserService
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

		const accessTokenExpiryDate =
			this.jwt?.decode(accessToken)?.exp ??
			new Date(this.jwt.decode(accessToken)?.exp * 1000).toISOString()

		const refreshTokenExpiryDate =
			this.jwt?.decode(refreshToken)?.exp ??
			new Date(this.jwt.decode(refreshToken)?.exp * 1000).toISOString()

		const token: TokenResponse = {
			accessToken,
			refreshToken,
			accessTokenExpiryDate,
			refreshTokenExpiryDate
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

		await this.detectExpiry(accessToken)
	}

	async detectExpiry(token: string) {
		const decodedToken = await this.jwt.decode(token)

		if (!decodedToken) {
			throw new BadRequestException('Token is Invalid!')
		}

		const currentTime = Math.floor(Date.now() / 1000)
		const tokenTime = decodedToken?.exp

		if (tokenTime && currentTime > tokenTime) {
			await this.addToBlacklist(token)
		}
		return decodedToken
	}

	async getNewTokens(dto: RefreshTokenDto): Promise<TokenResponse> {
		const result = await this.jwt.verifyAsync(dto.refreshToken, {
			secret: this.envConfig.get('JWT_SECRET')
		})

		if (!result) {
			throw new BadRequestException('Invalid Refresh Token!')
		}

		await this.detectExpiry(dto.refreshToken)

		const user = await this.userService.getById(result?.id)
		const newTokens = await this.generateTokens(user.id)

		return newTokens
	}
}
