import { DocumentBuilder } from '@nestjs/swagger'

export const swagger = new DocumentBuilder()
	.setTitle('NestJS Api Docs')
	.setDescription('NestJS Application Swagger')
	.setVersion('1.0.0')
	.build()
