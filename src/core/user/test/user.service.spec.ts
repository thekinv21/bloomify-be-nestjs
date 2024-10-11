import { Test, TestingModule } from '@nestjs/testing'
import { UserService } from '../user.service'

class ApiServiceMock {
	async starter() {
		return `NestJS Application Successfully Works`
	}
}

describe('UserService', () => {
	let moduleRef: TestingModule
	let service: UserService

	beforeAll(async () => {
		const ApiServiceProvider = {
			provide: UserService,
			useClass: ApiServiceMock
		}
		moduleRef = await Test.createTestingModule({
			providers: [UserService, ApiServiceProvider]
		}).compile()
		service = moduleRef.get<UserService>(UserService)
	})

	describe('', () => {
		it('', async () => {})
	})
})
