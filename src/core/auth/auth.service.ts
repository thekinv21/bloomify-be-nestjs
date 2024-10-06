import {
	Injectable,
	NotFoundException,
	UnauthorizedException
} from '@nestjs/common'
import { hash, verify } from 'argon2'
import { plainToInstance } from 'class-transformer'
import { PrismaService } from 'prisma/prisma.service'
import { UserDto } from '../user/dto/user.response'
import { UserService } from '../user/user.service'
import {
	LoginDto,
	RefreshTokenDto,
	RegisterDto,
	TokenDto
} from './dto/auth.request'
import { AuthResponseDto, TokenResponse } from './dto/auth.response'
import { JwtAuthService } from './jwt/jwt.service'

@Injectable()
export class AuthService {
	constructor(
		private readonly prismaService: PrismaService,
		private readonly jwtService: JwtAuthService,
		private readonly userService: UserService
	) {}

	async register(dto: RegisterDto): Promise<AuthResponseDto | null> {
		await this.userService.isUnique(dto.username, dto.email)

		const newUser = plainToInstance(
			UserDto,
			await this.prismaService.user.create({
				data: {
					...dto,
					password: await hash(dto.password)
				}
			})
		)
		const response: AuthResponseDto = {
			user: newUser,
			token: await this.jwtService.generateTokens(newUser.id)
		}

		return response
	}

	async login(dto: LoginDto): Promise<AuthResponseDto | null> {
		const user = await this.validateUser(dto)
		const response: AuthResponseDto = {
			user: user,
			token: await this.jwtService.generateTokens(user?.id)
		}
		return response
	}

	async refreshToken(dto: RefreshTokenDto): Promise<TokenResponse | null> {
		return null
	}

	async logout(dto: TokenDto): Promise<void> {
		await this.jwtService.addToBlacklist(dto.accessToken)
	}

	async validateUser(dto: LoginDto) {
		const isUser = await this.prismaService.user.findUnique({
			where: {
				username: dto.username?.toLocaleLowerCase()
			}
		})

		if (!isUser) throw new NotFoundException('User not found!')

		const isValidUser = await verify(isUser?.password, dto.password)

		if (!isValidUser) {
			throw new UnauthorizedException('Invalid Credentials')
		}

		return plainToInstance(UserDto, isUser)
	}
}
