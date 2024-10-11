import {
	BadRequestException,
	ConflictException,
	Injectable,
	NotFoundException
} from '@nestjs/common'
import { hash } from 'argon2'
import { plainToInstance } from 'class-transformer'
import { UUID } from 'crypto'

import {
	buildOrderBy,
	buildSearchBy,
	PaginationDto,
	PaginationParams,
	RoleEnum
} from '@/base'
import { PrismaService } from '@/root/prisma'
import { Role } from '@prisma/client'
import { RoleDtoForUser } from '../role/dto/request.dto'

import { RoleService } from '../role/roles.service'
import { CreateUserDto, UpdateUserDto } from './dto/user.request'
import { UserDto } from './dto/user.response'

@Injectable()
export class UserService {
	constructor(
		private readonly prismaService: PrismaService,
		private readonly roleService: RoleService
	) {}

	async getAll(args: PaginationParams): Promise<PaginationDto<UserDto[]>> {
		const { page, pageSize, searchTerm, orderBy, direction } = args

		const searchBy = buildSearchBy(searchTerm, [
			'firstName',
			'lastName',
			'username',
			'email'
		])
		const orderObjectBy = buildOrderBy(orderBy, direction)

		const [users, total] = await Promise.all([
			this.prismaService.user.findMany({
				skip: +page * +pageSize,
				take: +pageSize,
				where: searchBy,
				orderBy: orderObjectBy,
				include: {
					roles: {
						include: {
							role: true
						}
					}
				}
			}),
			this.prismaService.user.count({
				where: searchBy
			})
		])

		return {
			total,
			content: plainToInstance(UserDto, users)
		}
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

		const roles = await this.roleService.findByIds(
			dto.roles as RoleDtoForUser[]
		)

		const newUser = await this.prismaService.user.create({
			data: {
				...dto,
				password: await hash(dto.password),
				roles: {
					create: roles.map((role: Role) => ({
						roleId: role.id
					}))
				}
			},
			include: {
				roles: {
					include: {
						role: true
					}
				}
			}
		})

		return plainToInstance(UserDto, newUser)
	}

	async update(dto: UpdateUserDto): Promise<UserDto> {
		await this.findById(dto.id)

		const roles = await this.roleService.findByIds(
			dto.roles as RoleDtoForUser[]
		)

		const updated = await this.prismaService.$transaction(async prisma => {
			await prisma.userRoles.deleteMany({
				where: {
					userId: dto.id
				}
			})

			const user = await prisma.user.update({
				where: { id: dto.id },
				data: {
					...dto,
					roles: {
						create: roles.map((role: Role) => ({
							roleId: role.id
						}))
					}
				},
				include: {
					roles: {
						include: {
							role: true
						}
					}
				}
			})

			return user
		})

		return plainToInstance(UserDto, updated)
	}

	async delete(id: UUID): Promise<void> {
		const user = await this.findById(id)

		// if (user.roles.includes(RoleEnum.SUPER_ADMIN)) {
		// 	throw new BadRequestException("Super Admin can't be deleted...")
		// }

		await this.prismaService.$transaction(async prisma => {
			await prisma.userRoles.deleteMany({
				where: {
					userId: id
				}
			})
		})

		await this.prismaService.user.delete({
			where: { id }
		})
	}

	async toggle(id: UUID): Promise<void> {
		const user = await this.findById(id)

		if (user.roles.includes(RoleEnum.SUPER_ADMIN)) {
			throw new BadRequestException("Super Admin can't be deactivate...")
		}

		await this.prismaService.user.update({
			where: { id },
			data: { isActive: !user.isActive }
		})
	}

	private async findById(id: UUID): Promise<UserDto> {
		const user = await this.prismaService.user.findUnique({
			where: { id },
			include: {
				roles: {
					include: {
						role: true
					}
				}
			}
		})

		if (!user) {
			throw new NotFoundException(`User ID: ${id} is not found!`)
		}

		return plainToInstance(UserDto, user)
	}

	private async findActiveById(id: UUID): Promise<UserDto> {
		const user = await this.prismaService.user.findUnique({
			where: { id, isActive: true },
			include: {
				roles: {
					include: {
						role: true
					}
				}
			}
		})

		if (!user) {
			throw new NotFoundException(`User with ID: ${id} is not found!`)
		}

		return plainToInstance(UserDto, user)
	}

	private async findByEmail(email: string): Promise<UserDto> {
		const user = await this.prismaService.user.findUnique({
			where: {
				email: email?.toLowerCase()
			},
			include: {
				roles: {
					include: {
						role: true
					}
				}
			}
		})

		if (!user) {
			throw new NotFoundException(`User with email: ${email} is not found!`)
		}

		return plainToInstance(UserDto, user)
	}

	private async findByUsername(username: string): Promise<UserDto> {
		const user = await this.prismaService.user.findUnique({
			where: {
				username: username?.toLowerCase()
			},
			include: {
				roles: {
					include: {
						role: true
					}
				}
			}
		})

		if (!user) {
			throw new NotFoundException(
				`User with username: ${username} is not found!`
			)
		}

		return plainToInstance(UserDto, user)
	}

	async isUnique(username: string, email: string): Promise<void> {
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
