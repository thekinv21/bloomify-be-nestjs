import {
	CallHandler,
	ExecutionContext,
	HttpException,
	HttpStatus,
	Injectable,
	NestInterceptor
} from '@nestjs/common'
import { Observable, throwError } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import {
	TypeNonPaginatedApiResponse,
	TypePaginatedApiResponse
} from '../dto/base.dto'

export type TypeApiResponse<T> =
	| TypeNonPaginatedApiResponse<T>
	| TypePaginatedApiResponse<T>

@Injectable()
export class ApiResponse<T> implements NestInterceptor<T, TypeApiResponse<T>> {
	intercept(
		context: ExecutionContext,
		next: CallHandler
	): Observable<TypeApiResponse<T>> {
		return next.handle().pipe(
			map((res: T | T[] | TypePaginatedApiResponse<T>) =>
				this.handleResponse(res, context)
			),
			catchError((error: HttpException) =>
				throwError(() => this.handleError(error, context))
			)
		)
	}

	private handleError(exception: HttpException, context: ExecutionContext) {
		const response = context.switchToHttp().getResponse()
		const req = context.switchToHttp().getRequest()
		const status =
			exception instanceof HttpException
				? exception.getStatus()
				: HttpStatus.INTERNAL_SERVER_ERROR

		let message: string | Array<{ errorMessage: string }> = exception.message

		if (exception.name === 'BadRequestException') {
			const errorResponse = exception.getResponse()
			if (typeof errorResponse === 'object' && 'message' in errorResponse) {
				message = Array.isArray(errorResponse['message'])
					? errorResponse['message'].map((msg: string) => ({
							errorMessage: msg
						}))
					: (errorResponse['message'] as string)
			}
		}

		response.status(status).json({
			isSuccess: false,
			status,
			path: req.url,
			message,
			exception: exception.name,
			timestamp: new Date().toISOString()
		})
	}

	private handleResponse(
		res: T | T[] | TypePaginatedApiResponse<T>,
		context: ExecutionContext
	): TypeApiResponse<T> {
		const response = context.switchToHttp().getResponse()
		const req = context.switchToHttp().getRequest()

		const page = parseInt(req.query.page, 0)
		const pageSize = parseInt(req.query.pageSize, 10)
		const status = response.statusCode

		if (res && res['total']) {
			const totalPages = Math.ceil(res['total'] / pageSize)
			return {
				isSuccess: true,
				status,
				path: req.url,
				timestamp: new Date().toISOString(),
				total: res['total'],
				page,
				pageSize,
				isFirstPage: page === 0,
				isLastPage: page === totalPages - 1,
				isEmpty: res['content']?.length > 0 ? false : true,
				totalPages: totalPages,
				content: res['content']
			} as TypePaginatedApiResponse<T>
		}

		return {
			isSuccess: true,
			status,
			path: req.url,
			timestamp: new Date().toISOString(),
			content: res
		} as TypeNonPaginatedApiResponse<T>
	}
}
