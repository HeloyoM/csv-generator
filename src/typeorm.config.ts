import { registerAs } from '@nestjs/config'
import { config as dotenvConfig } from 'dotenv'
import { DataSource, DataSourceOptions } from 'typeorm'
dotenvConfig({ path: '.env' })

const config = {
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: '12345678',
    database: 'csv',

    autoLoadEntities: true,
    synchronize: false,

    entities: [
        'dist/User/**/models/*{.js,.ts}',
        'dist/Airport/**/models/*{.js,.ts}',
        'dist/Car/**/models/*{.js,.ts}',
        'dist/Hotel/**/models/*{.js,.ts}',
    ],
    migrations: ['dist/migrations/common/**/*{.js,.ts}'],
    subscribers: ['dist/subscribers/common/**/*{.js,.ts}'],

    extra: {
        ssl: {
            rejectUnauthorized: false
        }
    }
}

export default registerAs('typeormCommon', () => config)
export const connectionSource = new DataSource(config as DataSourceOptions)