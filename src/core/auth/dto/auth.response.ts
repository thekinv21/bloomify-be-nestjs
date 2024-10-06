import { UserDto } from 'src/core/user/dto/user.response'

export class AuthResponseDto {
	user: UserDto
	token: TokenResponse
}

export class TokenResponse {
	accessToken: string
	refreshToken: string
	expiryDate: Date
}
