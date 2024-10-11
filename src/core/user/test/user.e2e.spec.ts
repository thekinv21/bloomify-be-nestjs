import { PrismaService } from '@/root/prisma'
import { PaginationParams } from '@/root/src/base'
import type { INestApplication } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { UUID } from 'crypto'
import { type Express } from 'express'
import supertest from 'supertest'
import { JwtAuthService } from '../../auth/jwt/jwt.service'
import { RoleService } from '../../role/roles.service'
import { CreateUserDto } from '../dto/user.request'
import { UserDto } from '../dto/user.response'
import { UserController } from '../user.controller'
import { UserService } from '../user.service'

let app: INestApplication<Express>
let request: supertest.SuperTest<supertest.Test>
let id: UUID
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
	firstName: 'Jest FirstName',
	lastName: 'Jest LastName',
	email: 'jest@example.com',
	username: 'jest_test',
	password: 'pass',
	isActive: true,
	roles: [{ id: 4 }]
}

const res: Omit<UserDto, 'password'> = {
	id: 'bcaddb03-e76e-49fd-b495-a513192be640',
	firstName: 'Jest FirstName',
	lastName: 'Jest LastName',
	email: 'jest@example.com',
	username: 'jest_test',
	createdAt: new Date('2024-10-11T15:43:15.133Z'),
	isActive: true,
	updatedAt: new Date('2024-10-11T15:43:15.133Z'),
	roles: ['USER']
}

describe('User module Controller and Service e2e Test', () => {
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
			expect(body).toContainEqual([res])
		} else {
			buildException(status, body)
		}
	})

	// get-by-id

	test('GET: /user/:id ', async () => {
		const { body, status } = await request.get(`/user/${id}`)
		if (status >= 200 && status < 300) {
			expect(body).toEqual(expect.objectContaining(res))
		} else {
			buildException(status, body)
		}
	})

	// get-by-email

	test('GET: /user/email/:email ', async () => {
		const { body, status } = await request.get(`/user/email/${email}`)
		if (status >= 200 && status < 300) {
			expect(body).toEqual(expect.objectContaining(res))
		} else {
			buildException(status, body)
		}
	})

	// get-by-username

	test('GET: /user/username/:username ', async () => {
		const { body, status } = await request.get(`/user/username/${username}`)
		if (status >= 200 && status < 300) {
			expect(body).toEqual(expect.objectContaining(res))
		} else {
			buildException(status, body)
		}
	})

	// create

	test('POST: /user', async () => {
		const { body, status } = await request.post('/user').send(req)
		if (status >= 200 && status < 300) {
			expect(status).toBe(200)
			expect(body).toEqual(expect.objectContaining(res))
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
			expect(body).toEqual(expect.objectContaining(res))
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

const buildException = (
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
