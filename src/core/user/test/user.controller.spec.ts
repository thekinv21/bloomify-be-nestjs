import { PrismaService } from '@/root/prisma'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { Test, TestingModule } from '@nestjs/testing'
import { JwtAuthService } from '../../auth/jwt/jwt.service'
import { RoleService } from '../../role/roles.service'
import { UserController } from '../user.controller'
import { UserService } from '../user.service'

describe('UserController', () => {
	let moduleRef: TestingModule
	let controller: UserController

	beforeAll(async () => {
		moduleRef = await Test.createTestingModule({
			controllers: [UserController],
			providers: [
				UserService,
				PrismaService,
				RoleService,
				JwtService,
				JwtAuthService,
				ConfigService
			]
		}).compile()
		controller = moduleRef.get<UserController>(UserController)
	})

	describe('getAll', () => {
		it('', async () => {})
	})
})
