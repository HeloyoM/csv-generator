import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { SwaggerModule } from '@nestjs/swagger'
import 'reflect-metadata'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  const cors = {
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  }

  app.enableCors(cors)

  await app.listen(3001, () => console.log(`app is runnig on port ${3001}`))
}
bootstrap()
