import { Test, TestingModule } from '@nestjs/testing'
import { AppController } from '../app.controller'
import { AppService } from '../app.service'

describe('AppService', () => {
	let app: TestingModule
	let controller: AppController

	beforeAll(async () => {
		app = await Test.createTestingModule({
			controllers: [AppController],
			providers: [AppService]
		}).compile()
		controller = app.get<AppController>(AppController)
	})

	describe('starter', () => {
		it('hello Controller should return "NestJS Application Successfully Works"', async () => {
			const response = 'NestJS Application Successfully Works'
			const message = await controller.starter()
			expect(message).toEqual(response)
		})
	})
})
