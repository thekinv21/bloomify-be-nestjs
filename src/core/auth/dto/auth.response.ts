export class AuthResponseDto {
	user: any
	token: TokenResponse
}

export class TokenResponse {
	accessToken: string
	refreshToken: string
	expiryDate: Date
}
