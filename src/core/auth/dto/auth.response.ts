import { UserDto } from '@/core/user/dto/user.response'

export class AuthResponseDto {
	user: UserDto
	token: TokenResponse
}

export class TokenResponse {
	accessToken: string
	refreshToken: string
	accessTokenExpiryDate: string
	refreshTokenExpiryDate: string
}
