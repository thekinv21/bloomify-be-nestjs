import { Injectable } from '@nestjs/common'
import { CreateRoleDto } from './dto/create-role.dto'
import { UpdateRoleDto } from './dto/update-role.dto'

@Injectable()
export class RoleService {
	getAll() {}

	getById(id: number) {}

	create(createRoleDto: CreateRoleDto) {}

	update(updateRoleDto: UpdateRoleDto) {}

	toggle(id: number) {}

	delete(id: number) {}
}
