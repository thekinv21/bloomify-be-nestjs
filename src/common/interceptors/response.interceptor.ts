import {
	CallHandler,
	ExecutionContext,
	HttpException,
	HttpStatus,
	Injectable,
	NestInterceptor
} from '@nestjs/common'
import { Response } from 'express'
import { Observable, throwError } from 'rxjs'
import { catchError, map } from 'rxjs/operators'

export type TypeApiResponse<T> = {
	isSuccess: boolean
	status: number
	path: string
	message?: string | Array<{ errorMessage: string }>
	content: Response<string, any>
	timestamp: string
}

@Injectable()
export class ApiResponseInterceptor<T>
	implements NestInterceptor<T, TypeApiResponse<T>>
{
	intercept(
		context: ExecutionContext,
		next: CallHandler
	): Observable<TypeApiResponse<T>> {
		return next.handle().pipe(
			map((res: Response) => this.responseHandler(res, context)),
			catchError((err: HttpException) =>
				throwError(() => this.errorHandler(err, context))
			)
		)
	}

	errorHandler(exception: HttpException, context: ExecutionContext) {
		const ctx = context.switchToHttp()
		const response = ctx.getResponse()
		const request = ctx.getRequest()

		const status =
			exception instanceof HttpException
				? exception.getStatus()
				: HttpStatus.INTERNAL_SERVER_ERROR

		let originalMessage = exception.message
		let customMessage: string | Array<{ errorMessage: string }> =
			originalMessage

		if (exception.name === 'BadRequestException') {
			const exceptionResponse = exception.getResponse()
			if (
				typeof exceptionResponse === 'object' &&
				'message' in exceptionResponse
			) {
				const message = exceptionResponse['message']
				if (Array.isArray(message)) {
					customMessage = message.map((msg: string) => ({
						errorMessage: msg
					}))
				} else {
					customMessage = message as string
				}
			}
		}

		response.status(status).json({
			isSuccess: false,
			status: status,
			path: request.url,
			message: customMessage,
			exception: exception.name,
			timestamp: new Date().toISOString()
		})
	}

	responseHandler(res: Response, context: ExecutionContext) {
		const ctx = context.switchToHttp()
		const response = ctx.getResponse()
		const request = ctx.getRequest()
		const statusCode = response.statusCode

		return {
			isSuccess: true,
			status: statusCode,
			path: request.url,
			timestamp: new Date().toISOString(),
			content: res
		}
	}
}
