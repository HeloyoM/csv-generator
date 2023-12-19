import { Controller, Get, Inject } from '@nestjs/common'
import db_constant from './database/constans'
import { DataSource } from 'typeorm'
import { CsvSeed } from './csv.seed'

@Controller('csv-generator')
export class CsvController {
    constructor(
        @Inject(db_constant.DATA_SOURCE) private readonly dataSource: DataSource,
        private readonly csvSeed: CsvSeed
    ) { }

    @Get()
    async uploadCsvFile() {
        const queryRunner = await this.dataSource.createQueryRunner()
        queryRunner.connect()

        return await this.csvSeed.up(queryRunner)
    }
}