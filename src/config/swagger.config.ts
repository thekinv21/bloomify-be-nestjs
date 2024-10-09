import { DocumentBuilder } from '@nestjs/swagger'

export const swagger = new DocumentBuilder()
	.setTitle('Application Doc')
	.setDescription('This is api docs for application')
	.setVersion('1.0.1')
	.addBearerAuth(
		{
			type: 'http',
			scheme: 'bearer',
			bearerFormat: 'JWT',
			in: 'header',
			description: 'JWT Authorization for Access'
		},
		'access-token'
	)
	.build()
