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
import { UUID } from 'crypto'
import { CreateUserDto, UpdateUserDto } from './dto/user.request'
import { UserDto } from './dto/user.response'
import { UserService } from './user.service'

@ApiTags('User')
@Controller('/user')
@UsePipes(new ValidationPipe())
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Get()
	async getAll(): Promise<UserDto[] | null> {
		return this.userService.getAll()
	}

	@Get(':id')
	async getById(@Param('id') id: UUID): Promise<UserDto | null> {
		return this.userService.getById(id)
	}

	@Get(':username')
	async getByUsername(
		@Param('username') username: string
	): Promise<UserDto | null> {
		return this.userService.getByUsername(username)
	}

	@Post()
	async create(@Body() dto: CreateUserDto): Promise<any> {
		return this.userService.create(dto)
	}

	@Put()
	async update(@Body() dto: UpdateUserDto): Promise<any> {
		return this.userService.update(dto)
	}

	@Delete(':id')
	async delete(@Param('id') id: UUID): Promise<void> {
		return this.userService.delete(id)
	}

	@Patch(':id')
	async toggle(@Param('id') id: UUID): Promise<void> {}
}
