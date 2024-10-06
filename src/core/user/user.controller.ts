import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
	Put,
	UseGuards,
	UsePipes,
	ValidationPipe
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { UUID } from 'crypto'

import { AuthGuard } from '@/common/guards/auth.guard'
import { CreateUserDto, UpdateUserDto } from './dto/user.request'
import { UserDto } from './dto/user.response'
import { UserService } from './user.service'

@ApiTags('User')
@Controller('/user')
@UseGuards(AuthGuard)
@UsePipes(new ValidationPipe())
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Get()
	getAll(): Promise<UserDto[] | null> {
		return this.userService.getAll()
	}

	@Get(':id')
	getById(@Param('id') id: UUID): Promise<UserDto | null> {
		return this.userService.getById(id)
	}

	@Get('username/:username')
	findByUsername(@Param('username') username: string): Promise<UserDto | null> {
		return this.userService.getByUsername(username)
	}

	@Get('email/:email')
	findByEmail(@Param('email') email: string): Promise<UserDto | null> {
		return this.userService.getByEmail(email)
	}

	@Post()
	create(@Body() dto: CreateUserDto): Promise<UserDto> {
		return this.userService.create(dto)
	}

	@Put()
	update(@Body() dto: UpdateUserDto): Promise<UserDto> {
		return this.userService.update(dto)
	}

	@Delete(':id')
	delete(@Param('id') id: UUID): Promise<void> {
		return this.userService.delete(id)
	}

	@Patch(':id')
	toggle(@Param('id') id: UUID): Promise<void> {
		return this.userService.toggle(id)
	}
}
