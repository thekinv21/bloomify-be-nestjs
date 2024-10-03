import { Module } from '@nestjs/common'
import { AuthController } from 'src/auth/auth.controller'
import { AuthService } from 'src/auth/auth.service'

@Module({
	controllers: [AuthController],
	providers: [AuthService],
	exports: [AuthService]
})
export class BaseModule {}
