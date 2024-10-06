import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { UUID } from 'crypto'
import { TokenResponse } from '../dto/auth.response'

@Injectable()
export class JwtAuthService {
	constructor(
		private readonly envConfig: ConfigService,
		private readonly jwt: JwtService
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
}
