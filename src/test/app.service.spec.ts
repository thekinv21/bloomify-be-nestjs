import { Test, TestingModule } from '@nestjs/testing'
import { AppService } from '../app.service'

class ApiServiceMock {
	async starter() {
		return `NestJS Application Successfully Works`
	}
}

describe('AppService', () => {
	let application: TestingModule
	let service: AppService

	beforeAll(async () => {
		const ApiServiceProvider = {
			provide: AppService,
			useClass: ApiServiceMock
		}
		application = await Test.createTestingModule({
			providers: [AppService, ApiServiceProvider]
		}).compile()
		service = application.get<AppService>(AppService)
	})

	describe('starter', () => {
		it('should return "NestJS Application Successfully Works"', async () => {
			const response = 'NestJS Application Successfully Works'
			const message = await service.starter()
			expect(message).toEqual(response)
		})
	})
})
