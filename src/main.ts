import * as dotenv from 'dotenv'

import { NestFactory } from '@nestjs/core'
import type { NestExpressApplication } from '@nestjs/platform-express'
import { SwaggerModule } from '@nestjs/swagger'
import { AppModule } from './app/app.module'

import { ApiResponseInterceptor, GlobalExceptionFilter } from './common'
import { swagger } from './config'

async function bootstrap() {
	const app = await NestFactory.create<NestExpressApplication>(AppModule)

	app.setGlobalPrefix('api')
	app.useGlobalFilters(new GlobalExceptionFilter())
	app.useGlobalInterceptors(new ApiResponseInterceptor())

	SwaggerModule.setup('docs', app, SwaggerModule.createDocument(app, swagger))

	await app.listen(process.env.PORT || 5200)

	dotenv.config()
}
bootstrap()
