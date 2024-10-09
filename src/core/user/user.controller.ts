import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
	Put,
	Query,
	UseGuards,
	UsePipes,
	ValidationPipe
} from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { UUID } from 'crypto'

import { PaginationDto, PaginationParams } from '@/base'
import { Auth } from '../auth/decorators/auth.decorator'
import { JwtAuthGuard } from '../auth/guards/jwt.guard'
import { CreateUserDto, UpdateUserDto } from './dto/user.request'
import { UserDto } from './dto/user.response'
import { UserService } from './user.service'

@Controller('/user')
@ApiTags('User')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@UsePipes(new ValidationPipe())
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Get()
	getAll(
		@Query() pagination: PaginationParams
	): Promise<PaginationDto<UserDto[]>> {
		return this.userService.getAll(pagination)
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
	@Auth('SUPER_ADMIN')
	create(@Body() dto: CreateUserDto): Promise<UserDto> {
		return this.userService.create(dto)
	}

	@Put()
	@Auth('SUPER_ADMIN')
	update(@Body() dto: UpdateUserDto): Promise<UserDto> {
		return this.userService.update(dto)
	}

	@Delete(':id')
	@Auth('SUPER_ADMIN')
	delete(@Param('id') id: UUID): Promise<void> {
		return this.userService.delete(id)
	}

	@Patch(':id')
	@Auth('SUPER_ADMIN')
	toggle(@Param('id') id: UUID): Promise<void> {
		return this.userService.toggle(id)
	}
}
