import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
	Put
} from '@nestjs/common'
import { CreateRoleDto } from './dto/create-role.dto'
import { UpdateRoleDto } from './dto/update-role.dto'
import { RoleService } from './roles.service'

@Controller('role')
export class RoleController {
	constructor(private readonly rolesService: RoleService) {}

	@Get()
	getAll() {
		return this.rolesService.getAll()
	}

	@Get(':id')
	getById(@Param('id') id: number) {
		return this.rolesService.getById(+id)
	}

	@Post()
	create(@Body() createRoleDto: CreateRoleDto) {
		return this.rolesService.create(createRoleDto)
	}

	@Put()
	update(updateRoleDto: UpdateRoleDto) {
		return this.rolesService.update(updateRoleDto)
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
