import { PrismaService } from '@/root/prisma/prisma.service'
import {
	ConflictException,
	Injectable,
	NotFoundException
} from '@nestjs/common'
import { plainToInstance } from 'class-transformer'

import { CreateRoleDto, UpdateRoleDto } from './dto/role.request'
import { RoleDto } from './dto/role.response'

@Injectable()
export class RoleService {
	constructor(private readonly prismaService: PrismaService) {}

	async getAll(): Promise<RoleDto[] | null> {
		return await this.prismaService.role.findMany({
			where: {
				isActive: true
			}
		})
	}

	async getById(id: number): Promise<RoleDto> {
		return this.findActiveById(id)
	}

	async getByRoleName(roleName: string): Promise<RoleDto | null> {
		const role = await this.prismaService.role.findFirst({
			where: {
				name: roleName
			}
		})
		if (!role) {
			throw new NotFoundException('Role is not found!')
		}

		return plainToInstance(RoleDto, role)
	}

	async create(dto: CreateRoleDto): Promise<RoleDto | null> {
		await this.isUnique(dto.name)

		const newRole = await this.prismaService.role.create({
			data: dto
		})
		return plainToInstance(RoleDto, newRole)
	}

	async update(dto: UpdateRoleDto): Promise<RoleDto> {
		await this.findById(dto.id)

		const updated = await this.prismaService.role.update({
			where: { id: +dto.id },
			data: dto
		})

		return plainToInstance(RoleDto, updated)
	}

	async delete(id: number): Promise<void> {
		await this.findById(id)

		await this.prismaService.role.delete({
			where: { id: +id }
		})
	}

	async toggle(id: number): Promise<void> {
		const role = await this.findById(id)

		await this.prismaService.role.update({
			where: { id: +id },
			data: { isActive: !role.isActive }
		})
	}

	private async findById(id: number): Promise<RoleDto> {
		const role = await this.prismaService.role.findUnique({
			where: { id: +id }
		})

		if (!role) {
			throw new NotFoundException(`Role with ID: ${id} is not found!`)
		}

		return plainToInstance(RoleDto, role)
	}

	private async findActiveById(id: number): Promise<RoleDto> {
		const role = await this.prismaService.role.findUnique({
			where: { id: +id, isActive: true }
		})

		if (!role) {
			throw new NotFoundException(`Role with ID: ${id} is not found!`)
		}

		return plainToInstance(RoleDto, role)
	}

	async isUnique(roleName: string): Promise<void> {
		const role = await this.prismaService.role.findFirst({
			where: {
				name: roleName
			}
		})
		if (role) {
			throw new ConflictException('Role Already Exist!')
		}
	}
}
