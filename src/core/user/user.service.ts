import { Injectable } from '@nestjs/common'
import { UUID } from 'crypto'
import { AuthResponseDto } from '../auth/dto/auth.response'
import { CreateUserDto, UpdateUserDto } from './dto/user.request'
import { UserDto } from './dto/user.response'

@Injectable()
export class UserService {
	async getAll(): Promise<UserDto[] | null> {
		return null
	}

	async getById(id: UUID): Promise<UserDto | null> {
		return null
	}

	async getByUsername(username: string): Promise<UserDto | null> {
		return null
	}

	async create(dto: CreateUserDto): Promise<AuthResponseDto | null> {
		return null
	}

	async update(dto: UpdateUserDto): Promise<UserDto | null> {
		return null
	}

	async delete(id: UUID): Promise<void> {}

	async toggle(id: UUID): Promise<void> {}
}
