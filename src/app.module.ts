import { Module, Scope } from '@nestjs/common'
import { AppService } from './app.service'
import { ConfigService, ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module'
import typeormCommon from './typeorm.config'
import { DatabaseModule } from './database/database.module'
import { CsvModule } from './csv.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [typeormCommon],
    }),

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) =>
        configService.get('typeormCommon'),
    }),

    DatabaseModule.register(Scope.REQUEST),

    CsvModule,
  ],
  controllers: [],
  providers: [AppService],
})
export class AppModule { }
