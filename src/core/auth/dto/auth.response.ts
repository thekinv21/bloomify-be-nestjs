import { UserDto } from '@/core/user/dto/user.response'

export class AuthResponseDto {
	user: Omit<UserDto, 'password'>
	token: TokenResponse
}

export class TokenResponse {
	accessToken: string
	refreshToken: string
	accessTokenExpiryDate: number
	refreshTokenExpiryDate: number
}
