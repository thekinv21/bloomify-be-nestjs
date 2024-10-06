import {
	ConflictException,
	Injectable,
	NotFoundException
} from '@nestjs/common'
import { hash } from 'argon2'
import { plainToInstance } from 'class-transformer'
import { UUID } from 'crypto'
import { PrismaService } from 'prisma/prisma.service'
import { CreateUserDto, UpdateUserDto } from './dto/user.request'
import { UserDto } from './dto/user.response'

@Injectable()
export class UserService {
	constructor(private readonly prismaService: PrismaService) {}

	async getAll(): Promise<UserDto[]> {
		const users = await this.prismaService.user.findMany({
			where: { isActive: true }
		})
		return plainToInstance(UserDto, users)
	}

	async getById(id: UUID): Promise<UserDto> {
		return this.findActiveById(id)
	}

	async getByUsername(email: string): Promise<UserDto | null> {
		return await this.findByUsername(email)
	}

	async getByEmail(email: string): Promise<UserDto | null> {
		return await this.findByEmail(email)
	}

	async create(dto: CreateUserDto): Promise<UserDto> {
		await this.isUnique(dto.username, dto.email)

		const newUser = await this.prismaService.user.create({
			data: {
				...dto,
				password: await hash(dto.password)
			}
		})

		return plainToInstance(UserDto, newUser)
	}

	async update(dto: UpdateUserDto): Promise<UserDto> {
		await this.findById(dto.id)

		const updated = await this.prismaService.user.update({
			where: { id: dto.id },
			data: dto
		})

		return plainToInstance(UserDto, updated)
	}

	async delete(id: UUID): Promise<void> {
		await this.findById(id)

		await this.prismaService.user.delete({
			where: { id }
		})
	}

	async toggle(id: UUID): Promise<void> {
		const user = await this.findById(id)

		await this.prismaService.user.update({
			where: { id },
			data: { isActive: !user.isActive }
		})
	}

	private async findById(id: UUID): Promise<UserDto> {
		const user = await this.prismaService.user.findUnique({
			where: { id }
		})

		if (!user) {
			throw new NotFoundException(`User ID: ${id} is not found!`)
		}

		return plainToInstance(UserDto, user)
	}

	private async findActiveById(id: UUID): Promise<UserDto> {
		const user = await this.prismaService.user.findUnique({
			where: { id, isActive: true }
		})

		if (!user) {
			throw new NotFoundException(`User with ID: ${id} is not found!`)
		}

		return plainToInstance(UserDto, user)
	}

	private async findByEmail(email: string): Promise<UserDto | null> {
		const user = await this.prismaService.user.findUnique({
			where: {
				email: email?.toLowerCase()
			}
		})

		if (!user) {
			throw new NotFoundException(`User with email: ${email} is not found!`)
		}

		return plainToInstance(UserDto, user)
	}

	private async findByUsername(username: string): Promise<UserDto | null> {
		const user = await this.prismaService.user.findUnique({
			where: {
				username: username?.toLowerCase()
			}
		})

		if (!user) {
			throw new NotFoundException(
				`User with username: ${username} is not found!`
			)
		}

		return plainToInstance(UserDto, user)
	}

	private async isUnique(username: string, email: string): Promise<void> {
		const isExistEmail = await this.prismaService.user.findUnique({
			where: {
				email: email?.toLowerCase()
			}
		})
		const isExistUsername = await this.prismaService.user.findUnique({
			where: {
				username: username?.toLowerCase()
			}
		})
		if (isExistEmail || isExistUsername) {
			throw new ConflictException('User already exists!')
		}
	}
}
