import { ApiProperty } from '@nestjs/swagger'

import { IsNotEmpty, IsString, MinLength } from 'class-validator'

export class LoginDto {
	@ApiProperty({
		example: 'steve',
		required: true
	})
	@IsString()
	@IsNotEmpty()
	@MinLength(5)
	username: string

	@ApiProperty({
		required: true,
		example: 'pass'
	})
	@IsString()
	@IsNotEmpty()
	password: string
}

export class RegisterDto {
	@ApiProperty({
		example: 'Steve',
		required: true
	})
	@IsString()
	@IsNotEmpty()
	firstName: string

	@ApiProperty({
		example: 'Jobs',
		required: true
	})
	@IsString()
	@IsNotEmpty()
	lastName: string

	@ApiProperty({
		example: 'steve@hotmail.com',
		required: true
	})
	@IsString()
	@IsNotEmpty()
	email: string

	@ApiProperty({
		example: 'steve',
		required: true
	})
	@IsString()
	@IsNotEmpty()
	@MinLength(5)
	username: string

	@ApiProperty({
		required: true,
		example: 'pass'
	})
	@IsString()
	@IsNotEmpty()
	@MinLength(5)
	password: string
}

export class RefreshTokenDto {
	@ApiProperty({
		example:
			'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
		required: true
	})
	@IsString()
	@IsNotEmpty()
	accessToken: string
}

export class TokenDto {
	accessToken: string
	refreshToken: string
	expiryDate?: string
}
