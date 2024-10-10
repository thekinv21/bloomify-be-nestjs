import { PrismaService } from '@/root/prisma'
import {
	ConflictException,
	Injectable,
	NotFoundException
} from '@nestjs/common'
import { Role } from '@prisma/client'
import { plainToInstance } from 'class-transformer'
import { CreateRoleDto, RoleDtoForUser, UpdateRoleDto } from './dto/request.dto'
import { RoleDto } from './dto/response.dto'

@Injectable()
export class RoleService {
	constructor(private readonly prismaService: PrismaService) {}

	async getAll(): Promise<RoleDto[]> {
		const roles = await this.prismaService.role.findMany({
			where: {
				isActive: true
			}
		})
		return plainToInstance(RoleDto, roles)
	}

	async getById(id: number): Promise<RoleDto> {
		const role = await this.findByIdActive(id)
		return plainToInstance(RoleDto, role)
	}

	async getByName(name: string): Promise<RoleDto> {
		const role = await this.prismaService.role.findUnique({
			where: {
				name,
				isActive: true
			}
		})

		if (!role) {
			throw new NotFoundException('Role is not found!')
		}

		return plainToInstance(RoleDto, role)
	}

	async create(dto: CreateRoleDto) {
		await this.isUnique(dto.name)

		const newRole = await this.prismaService.role.create({
			data: dto
		})

		return plainToInstance(RoleDto, newRole)
	}

	async update(dto: UpdateRoleDto) {
		await this.findByIdActive(dto.id)

		const updatedRole = await this.prismaService.role.update({
			where: {
				id: dto.id
			},
			data: dto
		})
		return plainToInstance(RoleDto, updatedRole)
	}

	async toggle(id: number): Promise<void> {
		const role = await this.findById(+id)

		await this.prismaService.role.update({
			where: {
				id: +id
			},
			data: {
				isActive: !role.isActive
			}
		})
	}

	async delete(id: number): Promise<void> {
		await this.findById(id)

		await this.prismaService.role.delete({
			where: {
				id: id
			}
		})
	}

	async findById(id: number): Promise<Role> {
		const role = await this.prismaService.role.findUnique({
			where: {
				id
			}
		})

		if (!role) {
			throw new NotFoundException('Role is not found!')
		}

		return role
	}

	async findByIdActive(id: number): Promise<Role> {
		const role = await this.prismaService.role.findUnique({
			where: {
				id,
				isActive: true
			}
		})

		if (!role) {
			throw new NotFoundException('Role is not found!')
		}

		return role
	}

	async isUnique(roleName: string) {
		const existingRole = await this.prismaService.role.findUnique({
			where: {
				name: roleName,
				isActive: true
			}
		})

		if (existingRole) {
			throw new ConflictException('Role is already exist!')
		}
	}

	async findByIds(dto: RoleDtoForUser[]) {
		const roles = this.prismaService.role.findMany({
			where: { id: { in: dto.map((role: RoleDtoForUser) => +role.id) } }
		})
		return roles
	}
}
