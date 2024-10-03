import { Injectable } from '@nestjs/common'
import { LoginDto, RefreshTokenDto, RegisterDto } from './dto/auth.dtos'

@Injectable()
export class AuthService {
	async register(dto: RegisterDto): Promise<string> {
		return 'Register  Service'
	}

	async login(dto: LoginDto): Promise<string> {
		return 'login  Service'
	}

	async refreshToken(dto: RefreshTokenDto): Promise<string> {
		return 'refreshToken  Service'
	}

	async validateUser(): Promise<string> {
		return 'validateUser  Service'
	}
}
