import { Provider, Scope } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { REQUEST } from '@nestjs/core'
import { DataSource } from 'typeorm'
import { DatabaseService } from './database.service'

export const dataSourceFactory: { [key: string]: Provider } = {
    [Scope.DEFAULT]: {
        provide: 'data_source',
        useFactory: (): null => {
            return null
        },
    },
    [Scope.REQUEST]: {
        provide: 'data_source',
        inject: [REQUEST, ConfigService, DatabaseService],
        scope: Scope.REQUEST,
        useFactory: async (
            req,
            configService: ConfigService,
            databaseService: DatabaseService,
        ): Promise<DataSource | null> => {

            return databaseService.getDBDataSource()
        }
    }
}