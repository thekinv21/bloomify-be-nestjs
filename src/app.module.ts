import { Module } from '@nestjs/common'
import { BaseModule } from './base.module'

@Module({
	imports: [BaseModule]
})
export class AppModule {}
