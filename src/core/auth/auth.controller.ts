import {
	Body,
	Controller,
	Get,
	Post,
	UseGuards,
	UsePipes,
	ValidationPipe
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { UUID } from 'crypto'
import { UserDto } from '../user/dto/user.response'
import { AuthService } from './auth.service'
import { CurrentUser } from './decorators/user.decorator'
import {
	LoginDto,
	RefreshTokenDto,
	RegisterDto,
	TokenDto
} from './dto/auth.request'
import { AuthResponseDto, TokenResponse } from './dto/auth.response'
import { JwtAuthGuard } from './guards/jwt.guard'

@ApiTags('Auth')
@Controller('/auth')
@UsePipes(new ValidationPipe())
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Get('/profile')
	@UseGuards(JwtAuthGuard)
	async getProfile(@CurrentUser('id') id: UUID): Promise<UserDto> {
		return this.authService.getProfile(id)
	}

	@Post('/register')
	async register(@Body() dto: RegisterDto): Promise<AuthResponseDto | null> {
		return this.authService.register(dto)
	}

	@Post('/login')
	async login(@Body() dto: LoginDto): Promise<AuthResponseDto | null> {
		return this.authService.login(dto)
	}

	@Post('/refresh-token')
	@UseGuards(JwtAuthGuard)
	async refresh(@Body() dto: RefreshTokenDto): Promise<TokenResponse | null> {
		return this.authService.refreshToken(dto)
	}

	@Post('/logout')
	@UseGuards(JwtAuthGuard)
	async logout(@Body() dto: TokenDto): Promise<void> {
		return this.authService.logout(dto)
	}
}
