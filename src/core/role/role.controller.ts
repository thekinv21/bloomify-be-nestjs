import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
	Put,
	UsePipes,
	ValidationPipe
} from '@nestjs/common'

import { ApiTags } from '@nestjs/swagger'
import { CreateRoleDto, UpdateRoleDto } from './dto/role.request'
import { RoleDto } from './dto/role.response'
import { RoleService } from './role.service'

@ApiTags('Role')
@Controller('role')
@UsePipes(new ValidationPipe())
export class RoleController {
	constructor(private readonly roleService: RoleService) {}

	@Get()
	getAll(): Promise<RoleDto[] | null> {
		return this.roleService.getAll()
	}

	@Get(':id')
	getById(@Param('id') id: number): Promise<RoleDto | null> {
		return this.roleService.getById(id)
	}

	@Get('roleName/:roleName')
	findByRoleName(@Param('roleName') username: string): Promise<RoleDto | null> {
		return this.roleService.getByRoleName(username)
	}

	@Post()
	create(@Body() dto: CreateRoleDto): Promise<RoleDto | null> {
		return this.roleService.create(dto)
	}

	@Put()
	update(@Body() dto: UpdateRoleDto): Promise<RoleDto> {
		return this.roleService.update(dto)
	}

	@Delete(':id')
	delete(@Param('id') id: number): Promise<void> {
		return this.roleService.delete(id)
	}

	@Patch(':id')
	toggle(@Param('id') id: number): Promise<void> {
		return this.roleService.toggle(id)
	}
}
