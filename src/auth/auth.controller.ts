import {
	Body,
	Controller,
	Get,
	Post,
	UsePipes,
	ValidationPipe
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { AuthService } from './auth.service'
import { LoginDto, RefreshTokenDto, RegisterDto } from './dto/auth.dtos'

@ApiTags('Auth')
@UsePipes(new ValidationPipe())
@Controller('/auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post('/register')
	async register(@Body() dto: RegisterDto): Promise<string> {
		return this.authService.register(dto)
	}

	@Post('/login')
	async login(@Body() dto: LoginDto): Promise<string> {
		return this.authService.login(dto)
	}

	@Post('/refresh-token')
	async refreshToken(@Body() dto: RefreshTokenDto): Promise<string> {
		return this.authService.refreshToken(dto)
	}

	@Get('/validate')
	async validateUser(): Promise<string> {
		return this.authService.validateUser()
	}
}
