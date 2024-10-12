import { PrismaService } from '@/root/prisma'
import type { INestApplication } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { type Express } from 'express'
import supertest from 'supertest'
import { IRole } from '../interface/role'

import {
	CreateRoleDto,
	JwtAuthService,
	RoleController,
	RoleService,
	UserService
} from '../../index'

let app: INestApplication<Express>
let request: supertest.SuperTest<supertest.Test>
let id: number
let roleName: string

beforeAll(async () => {
	const moduleRef = await Test.createTestingModule({
		controllers: [RoleController],
		providers: [
			RoleService,
			PrismaService,
			JwtService,
			JwtAuthService,
			ConfigService,
			UserService
		]
	}).compile()

	app = moduleRef.createNestApplication()
	await app.init()
	request = supertest(app.getHttpServer())
})

afterAll(async () => {
	await app.close()
})

const req: CreateRoleDto = {
	name: 'USER',
	isActive: true
}

const res: IRole = {
	id: 1,
	name: 'USER',
	isActive: true,
	createdAt: new Date('2024-10-11T15:43:15.133Z'),
	updatedAt: new Date('2024-10-11T15:43:15.133Z')
}

describe('Role (e2e)', () => {
	test('GET: /role', async () => {
		const { body, status } = await request.get(`/role`)

		if (status >= 200 && status < 300) {
			expect(body).toContainEqual(Array(res))
		} else {
			buildException(status, body)
		}
	})

	// get-by-id

	test('GET: /role/:id ', async () => {
		const { body, status } = await request.get(`/role/${id}`)
		if (status >= 200 && status < 300) {
			expect(body).toEqual(expect.objectContaining(res))
		} else {
			buildException(status, body)
		}
	})

	// get-role-by-name

	test('GET: /role/roleName/:name ', async () => {
		const { body, status } = await request.get(`/role/roleName/${roleName}`)
		if (status >= 200 && status < 300) {
			expect(body).toEqual(expect.objectContaining(res))
		} else {
			buildException(status, body)
		}
	})

	// create

	test('POST: /role', async () => {
		const { body, status } = await request.post('/role').send(req)
		if (status >= 200 && status < 300) {
			expect(body).toEqual(expect.objectContaining(res))
		} else {
			buildException(status, body)
		}
	})

	// update

	test('PUT: /role', async () => {
		const { body, status } = await request.put(`/role`).send({
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

	test('DELETE: /role/:id', async () => {
		const { body, status } = await request.delete(`/role/${id}`)
		if (status >= 200 && status < 300) {
			expect(body).toBeUndefined()
		} else {
			buildException(status, body)
		}
	})

	// toggle

	test('PATCH: /role/:id', async () => {
		const { body, status } = await request.patch(`/role/${id}`)
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
			expect(body.message).toBe(`Role is not found!`)
			break

		case 409:
			expect(body.message).toBe(`Role is already exist!`)

		case 500:
			expect(body.message).toBe('Internal server error')
			break

		case 400:
			expect(body.message).toBe('BadRequest')
			break
		default:
			break
	}
}
