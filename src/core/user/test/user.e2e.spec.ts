import { PrismaService } from '@/root/prisma'
import { PaginationParams } from '@/root/src/base'
import type { INestApplication } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { UUID } from 'crypto'
import { type Express } from 'express'
import supertest from 'supertest'

import {
	CreateUserDto,
	JwtAuthService,
	RoleService,
	UserController,
	UserDto,
	UserService
} from '../../index'

let app: INestApplication<Express>
export let request: supertest.SuperTest<supertest.Test>
export let id: UUID
let email: string
let username: string

beforeAll(async () => {
	const moduleRef = await Test.createTestingModule({
		controllers: [UserController],
		providers: [
			UserService,
			RoleService,
			JwtService,
			JwtAuthService,
			ConfigService,
			PrismaService
		]
	}).compile()

	app = moduleRef.createNestApplication()
	await app.init()
	request = supertest(app.getHttpServer())
})

afterAll(async () => {
	await app.close()
})

const req: CreateUserDto = {
	firstName: 'Test JestFirstName',
	lastName: 'Test JestLastName ',
	email: 'test@example.com',
	username: 'test_jest',
	password: '123456',
	isActive: true,
	roles: [
		{
			id: 4
		}
	]
}

export const response: Omit<UserDto, 'password'> = {
	id: 'e808e8a7-276f-450e-a776-0a19db0601dc',
	firstName: 'Test Jest',
	lastName: 'Test Jest ',
	username: 'test_jest',
	email: 'test@example.com',
	createdAt: '2024-10-12T12:30:45.572Z',
	isActive: true,
	updatedAt: '2024-10-12T12:30:45.572Z',
	roles: ['USER']
}

describe('User (e2e)', () => {
	const params: PaginationParams = {
		page: 0,
		pageSize: 10,
		searchTerm: '',
		orderBy: 'updatedAt',
		direction: 'desc'
	}

	test('GET: /user', async () => {
		const { body, status } = await request.get(`/user`).query(params)

		expect(params.page).toBeDefined()
		expect(params.pageSize).toBeDefined()
		expect(params.page).toBeGreaterThanOrEqual(0)
		expect(params.pageSize).toBeGreaterThanOrEqual(1)

		if (status >= 200 && status < 300) {
			expect(body).toContainEqual(Array(response))
		} else {
			buildException(status, body)
		}
	})

	// get-by-id

	test('GET: /user/:id ', async () => {
		const { body, status } = await request.get(`/user/${id}`)
		if (status >= 200 && status < 300) {
			expect(body).toEqual(expect.objectContaining(response))
		} else {
			buildException(status, body)
		}
	})

	// get-by-email

	test('GET: /user/email/:email ', async () => {
		const { body, status } = await request.get(`/user/email/${email}`)
		if (status >= 200 && status < 300) {
			expect(body).toEqual(expect.objectContaining(response))
		} else {
			buildException(status, body)
		}
	})

	// get-by-username

	test('GET: /user/username/:username ', async () => {
		const { body, status } = await request.get(`/user/username/${username}`)
		if (status >= 200 && status < 300) {
			expect(body).toEqual(expect.objectContaining(response))
		} else {
			buildException(status, body)
		}
	})

	// create

	test('POST: /user', async () => {
		const { body, status } = await request.post('/user').send(req)
		if (status >= 200 && status < 300) {
			expect(status).toBe(200)
			expect(body).toEqual(expect.objectContaining(response))
		} else {
			buildException(status, body)
		}
	})

	// update

	test('PUT: /user', async () => {
		const { body, status } = await request.put(`/user`).send({
			id: id,
			...req
		})
		if (status >= 200 && status < 300) {
			expect(body).toEqual(expect.objectContaining(response))
		} else {
			buildException(status, body)
		}
	})

	// delete

	test('DELETE: /user/:id', async () => {
		const { body, status } = await request.delete(`/user/${id}`)
		if (status >= 200 && status < 300) {
			expect(body).toBeUndefined()
		} else {
			buildException(status, body)
		}
	})

	// toggle

	test('PATCH: /user/:id', async () => {
		const { body, status } = await request.patch(`/user/${id}`)
		if (status >= 200 && status < 300) {
			expect(body).toBeUndefined()
		} else {
			buildException(status, body)
		}
	})
})

export const buildException = (
	status: number,
	body: { message: string; error: string }
) => {
	switch (status) {
		case 401:
			expect(body.message).toBe("Oops! You're not authorized...")
			break
		case 404:
			expect(body.message).toBe(`User with ID: ${id} is not found!`)
			break

		case 409:
			expect(body.message).toBe(`User already exist!`)

		case 500:
			expect(body.message).toBe('Internal server error')
			break

		case 400:
			expect(status).toBe(400)

			break
		default:
			break
	}
}
