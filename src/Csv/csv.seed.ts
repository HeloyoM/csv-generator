import { QueryRunner } from "typeorm"
import * as path from "path"
import { ParsedPath } from "path"
import { Logger } from "@nestjs/common"
import { FileDefinition } from "./models/FileDefinition.model"
import * as ExcelJS from 'exceljs'
import { ExcelReader } from "./models/FileTypes/ExcelReader.model"
import { CsvReader } from "./models/FileTypes/csvReader.model"

export class Main {
    private readonly logger = new Logger(Main.name)
    private filePath: ParsedPath
    private error: string
    private csvDataFile: any

    constructor() { }

    public async up(queryRunner: QueryRunner) {
        try {
            const csv = await this.getFileRows()

            this.csvDataFile = new FileDefinition(csv)

            try {
                if (!await this.seekExistsTable(queryRunner)) {
                    await this.createTable(queryRunner)
                    await this.insertTableRecords(queryRunner)
                } else {
                    await this.insertTableRecords(queryRunner)
                }
            } catch (error) {
                this.logger.log(error)
            }

            await queryRunner.release()

        } catch (error) {
            this.logger.log(this.error)
        }
    }

    private async getFileRows(): Promise<any> {
        const file = path.join(__dirname, '../../csv-files/budget.xlsx') // file location

        this.filePath = path.parse(file)

        let records = []

        if (this.filePath.ext === '.xlsx') {
            const excelFile = new ExcelReader()

            records = await excelFile.readRecords(file)
        } else if (this.filePath.ext === '.csv') {
            const csvFile = new CsvReader()

            records = await csvFile.readRecords(file)
        }

        if (!file.trim())
            this.error = 'Empty file. Check again csv file location'

        return this.removeInvalidRows(records)
    }

    private removeInvalidRows(records: any[]): any[] {
        return records.map(subArray => subArray.filter(element => element !== undefined))
    }

    private async seekExistsTable(queryRunner: QueryRunner): Promise<boolean> {
        try {
            const table = await queryRunner.query(`SELECT * FROM information_schema.tables WHERE TABLE_NAME = '${this.filePath.name}'`)
            return Boolean(table.lenght)
        } catch (error) {
            this.error = `${error}`
        }
    }

    private async createTable(queryRunner: QueryRunner) {
        try {
            const cloumnsDefinition = this.csvDataFile.getQueryString()
            await queryRunner.query(`CREATE TABLE IF NOT EXISTS ${this.filePath.name} (${cloumnsDefinition})`)
        } catch (error) {
            this.logger.log(error)
        }
    }

    private async insertTableRecords(queryRunner: QueryRunner) {
        try {
            for (const r of this.csvDataFile.getRecords()) {
                try {
                    await queryRunner.query(`
                        INSERT INTO ${this.filePath.name} (${this.csvDataFile.getColumns()})
                        VALUES (${r.map(value => (typeof value == 'string' && value.includes("'") ? `'${value.replace(/'/g, '')}'` : `'${value}'`)).join(', ')}
                        )`)
                } catch (error) {
                    throw Error(`An error occurred while saving new ${this.filePath.name} [${JSON.stringify(r.join(', '))}]`)
                }

            }
        } catch (error) {
            this.logger.log(error)
        }
    }

    public async down() { }
}