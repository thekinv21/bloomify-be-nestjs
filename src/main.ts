import { NestFactory } from '@nestjs/core'
import type { NestExpressApplication } from '@nestjs/platform-express'
import { SwaggerModule } from '@nestjs/swagger'
import { AppModule } from './app.module'
import { swagger } from './config/swagger.config'

async function bootstrap() {
	const app = await NestFactory.create<NestExpressApplication>(AppModule)

	app.setGlobalPrefix('api')

	const document = SwaggerModule.createDocument(app, swagger)
	SwaggerModule.setup('docs', app, document)

	await app.listen(process.env.PORT || 4200)
}
bootstrap()
