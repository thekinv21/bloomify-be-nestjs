import { PrismaService } from '@/root/prisma/prisma.service'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { AuthController } from './auth/auth.controller'
import { AuthService } from './auth/auth.service'
import { JwtAuthService } from './auth/jwt/jwt.service'
import { RoleController } from './role/roles.controller'
import { RoleService } from './role/roles.service'
import { UserController } from './user/user.controller'
import { UserService } from './user/user.service'

@Module({
	imports: [ConfigModule.forRoot()],
	controllers: [AuthController, UserController, RoleController],
	providers: [
		AuthService,
		UserService,
		PrismaService,
		JwtService,
		JwtAuthService,
		RoleService
	],
	exports: []
})
export class CoreModule {}
