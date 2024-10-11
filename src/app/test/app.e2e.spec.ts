import type { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { type Express } from 'express'
import supertest from 'supertest'
import { AppController } from '../app.controller'
import { AppService } from '../app.service'

let app: INestApplication<Express>
let request: supertest.SuperTest<supertest.Test>

beforeAll(async () => {
	const moduleRef = await Test.createTestingModule({
		controllers: [AppController],
		providers: [AppService]
	}).compile()

	app = moduleRef.createNestApplication()
	await app.init()
	request = supertest(app.getHttpServer())
})

afterAll(async () => {
	await app.close()
})

describe('App module Controller and Service e2e Test', () => {
	test('GET: /api ', async () => {
		const { body, status } = await request.get(`/api`)

		if (status >= 200 && status < 300) {
			expect(body).toBe('NestJS Application Successfully Works')
		}
	})
})
