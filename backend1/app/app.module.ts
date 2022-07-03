import { Module } from '@nestjs/common'
import { AppController } from 'backend1/app/app.controller'

@Module({
  controllers: [AppController],
  imports: []
})

export class AppModule {}
