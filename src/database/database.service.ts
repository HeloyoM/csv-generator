import { Injectable } from '@nestjs/common'
import { DataSource } from 'typeorm'
import DataSourceManager from './data-source-manager.util'

@Injectable()
export class DatabaseService {
    async getDBDataSource(): Promise<DataSource> {
        return DataSourceManager.getInstance().getDBDataSource()
    }
}