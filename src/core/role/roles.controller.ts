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

import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { CreateRoleDto, UpdateRoleDto } from './dto/request.dto'

import { RoleEnum } from '../../base'
import { Auth } from '../auth/decorators/auth.decorator'
import { RoleDto } from './dto/response.dto'
import { RoleService } from './roles.service'

@Controller('role')
@ApiTags('Role')
@ApiBearerAuth('access-token')
@UsePipes(new ValidationPipe())
export class RoleController {
	constructor(private readonly rolesService: RoleService) {}

	@Get()
	@Auth([RoleEnum.ADMIN])
	getAll(): Promise<RoleDto[]> {
		return this.rolesService.getAll()
	}

	@Get(':id')
	@Auth([RoleEnum.ADMIN])
	getById(@Param('id') id: number): Promise<RoleDto> {
		return this.rolesService.getById(+id)
	}

	@Get('/roleName/:name')
	@Auth([RoleEnum.ADMIN])
	getByName(@Param('name') name: string): Promise<RoleDto> {
		return this.rolesService.getByName(name)
	}

	@Post()
	@Auth([RoleEnum.SUPER_ADMIN])
	create(@Body() dto: CreateRoleDto) {
		return this.rolesService.create(dto)
	}

	@Put()
	@Auth([RoleEnum.SUPER_ADMIN])
	update(@Body() dto: UpdateRoleDto) {
		return this.rolesService.update(dto)
	}

	@Patch(':id')
	@Auth([RoleEnum.SUPER_ADMIN])
	toggle(@Param('id') id: number) {
		return this.rolesService.toggle(id)
	}

	@Delete(':id')
	@Auth([RoleEnum.SUPER_ADMIN])
	delete(@Param('id') id: number) {
		return this.rolesService.delete(+id)
	}
}
