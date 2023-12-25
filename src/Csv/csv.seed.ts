import { QueryRunner } from "typeorm"
import { readFileSync } from "fs"
import * as path from "path"
import { ParsedPath } from "path"
import { Logger } from "@nestjs/common"
import { parse } from 'csv-parse/sync'
import { FileDefinition } from "./models/FileDefinition.model"

export class Main {
    private readonly logger = new Logger(Main.name)
    private fileName: ParsedPath
    private error: string
    private csvDataFile: any

    constructor() { }

    public async up(queryRunner: QueryRunner) {
        try {
            const csv = await this.getCsvFile();
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

    private async getCsvFile(): Promise<any> {
        const file = path.join(__dirname, '../../csv-files/airports.csv') // file location
        const csv = readFileSync(file, 'utf-8')

        const records = parse(csv)

        if (!file.trim()) {
            this.error = 'Empty file. Check again csv file location'
        }

        try {
            this.tableName(file)

            return records
        } catch (error) {
            this.logger.log(error)
        }
    }

    private tableName(file: string): void {
        this.fileName = path.parse(file)
    }

    private async seekExistsTable(queryRunner: QueryRunner): Promise<boolean> {
        try {
            const table = await queryRunner.query(`SELECT * FROM information_schema.tables WHERE TABLE_NAME = '${this.fileName.name}'`)
            return Boolean(table.lenght)
        } catch (error) {
            this.error = `${error}`
        }
    }

    private async createTable(queryRunner: QueryRunner) {
        try {
            const cloumnsDefinition = this.csvDataFile.getQueryString()
            await queryRunner.query(`CREATE TABLE IF NOT EXISTS ${this.fileName.name} (${cloumnsDefinition})`)
        } catch (error) {
            this.logger.log(error)
        }
    }

    private async insertTableRecords(queryRunner: QueryRunner) {
        try {
            for (const r of this.csvDataFile.getRecords()) {
                try {
                    await queryRunner.query(`
                        INSERT INTO ${this.fileName.name} (${this.csvDataFile.getColumns()})
                        VALUES (${r.map(value => (typeof value == 'string' && value.includes("'") ? `'${value.replace(/'/g, '')}'` : `'${value}'`)).join(', ')}
                        );`)
                } catch (error) {
                    throw Error(`An error occurred while saving new ${this.fileName.name} [${JSON.stringify(r.join(', '))}]`)
                }

            }
        } catch (error) {
            this.logger.log(error)
        }
    }

    public async down() { }
}