import {
	ConflictException,
	Injectable,
	NotFoundException
} from '@nestjs/common'
import { UUID } from 'crypto'
import { PrismaService } from 'prisma/prisma.service'
import { AuthResponseDto } from '../auth/dto/auth.response'
import { CreateUserDto, UpdateUserDto } from './dto/user.request'
import { UserDto } from './dto/user.response'

@Injectable()
export class UserService {
	constructor(private readonly prismaService: PrismaService) {}

	async getAll(): Promise<UserDto[] | null> {
		return await this.prismaService.user.findMany({
			where: {
				isActive: true
			}
		})
	}

	async getById(id: UUID): Promise<UserDto | null> {
		const isHaveUser = await this.prismaService.user.findUnique({
			where: {
				id,
				isActive: true
			}
		})

		if (!isHaveUser) {
			throw new NotFoundException('User is not found!')
		}

		return null
	}

	async getByUsername(username: string): Promise<UserDto | null> {
		const isHaveUser = await this.prismaService.user.findUnique({
			where: {
				username,
				isActive: true
			}
		})

		if (!isHaveUser) {
			throw new NotFoundException('User is not found!')
		}

		return null
	}

	async create(dto: CreateUserDto): Promise<AuthResponseDto | null> {
		const isHaveUser = await this.prismaService.user.findUnique({
			where: {
				username: dto.username,
				email: dto.email
			}
		})

		if (isHaveUser) {
			throw new ConflictException('User already exist!')
		}

		await this.prismaService.user.create({
			data: dto
		})

		return null
	}

	async update(dto: UpdateUserDto): Promise<UserDto | null> {
		await this.getById(dto.id)
		await this.prismaService.user.update({
			where: {
				id: dto.id
			},
			data: dto
		})
		return null
	}

	async delete(id: UUID): Promise<void> {
		await this.getById(id)

		await this.prismaService.user.delete({
			where: {
				id
			}
		})
	}

	async toggle(id: UUID): Promise<void> {
		const isHaveUser = await this.getById(id)

		await this.prismaService.user.update({
			where: {
				id
			},
			data: {
				isActive: !isHaveUser?.isActive
			}
		})
	}
}
