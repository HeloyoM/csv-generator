import { DynamicModule, Module, Scope } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import dbConstants from './constans'
import { DatabaseService } from './database.service'
import { dataSourceFactory } from './data-source-factory'

@Module({
    imports: [],
    exports: []
})
export class DatabaseModule {
    static register(scopeType: Scope): DynamicModule {
        return {
            module: DatabaseModule,
            imports: [ConfigModule],
            providers: [dataSourceFactory[scopeType], DatabaseService],
            exports: [dbConstants.DATA_SOURCE, DatabaseService],
        }
    }
}