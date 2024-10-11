import { Injectable } from '@nestjs/common'

@Injectable()
export class AppService {
	starter() {
		return `NestJS Application Successfully Works`
	}
}
