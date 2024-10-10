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
import { CreateRoleDto, UpdateRoleDto } from './dto/request.dto'

import { RoleDto } from './dto/response.dto'
import { RoleService } from './roles.service'

@ApiTags('Role')
@Controller('role')
@UsePipes(new ValidationPipe())
export class RoleController {
	constructor(private readonly rolesService: RoleService) {}

	@Get()
	getAll(): Promise<RoleDto[]> {
		return this.rolesService.getAll()
	}

	@Get(':id')
	getById(@Param('id') id: number): Promise<RoleDto> {
		return this.rolesService.getById(+id)
	}

	@Get('/roleName/:name')
	getByName(@Param('name') name: string): Promise<RoleDto> {
		return this.rolesService.getByName(name)
	}

	@Post()
	create(@Body() dto: CreateRoleDto) {
		return this.rolesService.create(dto)
	}

	@Put()
	update(@Body() dto: UpdateRoleDto) {
		return this.rolesService.update(dto)
	}

	@Patch(':id')
	toggle(@Param('id') id: number) {
		return this.rolesService.toggle(id)
	}

	@Delete(':id')
	delete(@Param('id') id: number) {
		return this.rolesService.delete(+id)
	}
}
