import { Injectable } from '@nestjs/common'

@Injectable()
export class AuthService {
	async register(): Promise<string> {
		return 'Register  Service'
	}

	async login(): Promise<string> {
		return 'login  Service'
	}

	async refreshToken(): Promise<string> {
		return 'refreshToken  Service'
	}

	async validateUser(): Promise<string> {
		return 'validateUser  Service'
	}
}
