import { PrismaService } from '@/root/prisma'
import type { INestApplication } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { type Express } from 'express'
import supertest from 'supertest'

import {
	AuthController,
	AuthResponseDto,
	AuthService,
	JwtAuthService,
	RoleService,
	TokenResponse,
	UserDto,
	UserService
} from '../../index'

let app: INestApplication<Express>
let request: supertest.SuperTest<supertest.Test>

export const userResponse: Omit<UserDto, 'password'> = {
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

const tokenResponse: Partial<TokenResponse> = {
	accessToken: expect.any(String),
	refreshToken: expect.any(String),
	accessTokenExpiryDate: expect.any(Number),
	refreshTokenExpiryDate: expect.any(Number)
}

const response: Partial<AuthResponseDto> = {
	user: expect.objectContaining({
		id: userResponse.id,
		firstName: userResponse.firstName,
		lastName: userResponse.lastName,
		username: userResponse.username,
		email: userResponse.email,
		isActive: userResponse.isActive,
		roles: userResponse.roles
	}),
	token: expect.objectContaining(tokenResponse)
}

beforeAll(async () => {
	const moduleRef = await Test.createTestingModule({
		controllers: [AuthController],
		providers: [
			UserService,
			AuthService,
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

describe('Auth (e2e)', () => {
	test('POST: /auth/profile ', async () => {
		const { body, status } = await request.get(`/auth/login`)
		if (status >= 200 && status < 300) {
			expect(body).toBeDefined()
			expect(body).toMatchObject(response.user as Omit<UserDto, 'password'>)
		} else {
			buildException(status, body)
		}
	})

	test('POST: /auth/login ', async () => {
		const { body, status } = await request.post(`/auth/login`).send({
			username: 'test_jest',
			password: '123456'
		})
		if (status >= 200 && status < 300) {
			expect(body).toBeDefined()
			expect(body).toMatchObject(response)
		} else {
			buildException(status, body)
		}
	})

	test('POST: /auth/register ', async () => {
		const { body, status } = await request.post(`/auth/register`).send({
			firstName: 'Test Jest',
			lastName: 'Test Jest ',
			username: 'test_jest',
			email: 'test@example.com',
			password: '123456',
			isActive: true
		})
		if (status >= 200 && status < 300) {
			expect(body).toBeDefined()
			expect(body).toMatchObject(response)
		} else {
			buildException(status, body)
		}
	})

	test('POST: /auth/refresh-token ', async () => {
		const { body, status } = await request
			.post(`/auth/refresh-token`)
			.send(response.token?.refreshToken)
		if (status >= 200 && status < 300) {
			expect(body).toBeDefined()
			expect(body).toMatchObject(response.token as TokenResponse)
		} else {
			buildException(status, body)
		}
	})

	test('POST: /auth/logout ', async () => {
		const { body, status } = await request
			.post(`/auth/logout`)
			.send(response.token?.accessToken)
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

		case 409:
			expect(body.message).toBe('User already exists!')
			break

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
