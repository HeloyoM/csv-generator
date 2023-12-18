import { DataSource } from 'typeorm'

export default class DataSourceManager {
    private static instance: DataSourceManager

    private dataSources: DataSource

    private constructor() {
        this.dataSources = {} as DataSource
    }

    public static getInstance(): DataSourceManager {
        if (!DataSourceManager.instance) {
            DataSourceManager.instance = new DataSourceManager()
        }

        return DataSourceManager.instance
    }

    async getDBDataSource(): Promise<DataSource> {

        let newDataSource = new DataSource({
            type: 'mysql',
            synchronize: false,

            entities: ['dist/**/models/*{.js,.ts}'],
            migrations: ['dist/migrations/**/*{.js,.ts}'],
            subscribers: ['dist/subscribers/**/*{.js,.ts}'],

            host: 'localhost',
            database: 'csv',
            port: 3306,
            username: 'root',
            password: '12345678',
            extra: {
                ssl: {
                    rejectUnauthorized: false
                }
            }
        })

        this.dataSources = newDataSource

        return Promise.resolve(newDataSource.initialize())
    }
}