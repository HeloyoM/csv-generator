import { QueryRunner } from "typeorm"
import { readFileSync } from "fs"
import * as path from "path"
import { ParsedPath } from "path"

import { FileDefinition } from "./fileDefinition"

export class Main {
    private fileName: ParsedPath
    private error: string
    private csvDataFile: any

    constructor() { }

    public async up(queryRunner: QueryRunner) {
        try {
            this.getCsvFile()

            try {
                if (!await this.seekExistsTable(queryRunner)) {
                    await this.createTable(queryRunner)
                    await this.insertTableRecords(queryRunner)
                } else {
                    await this.insertTableRecords(queryRunner)
                }
            } catch (error) {
                throw Error(error)
            }

            await queryRunner.release()

        } catch (error) {
            throw Error(this.error)
        }
    }

    private async getCsvFile() {
        const file = path.join(__dirname, '../csv-files/users.csv') // file location
        const csv = readFileSync(file, 'utf-8')

        const recordsString = csv.toString().split('\r')

        if (!file.trim()) {
            this.error = 'Empty file. Check again csv file location'
        }

        try {
            this.tableName(file)

            this.csvDataFile = new FileDefinition(recordsString)
        } catch (error) {
            throw Error()
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
            const cloumnsDefinition = this.csvDataFile.queryString.split(',').join(',')
            await queryRunner.query(`CREATE TABLE IF NOT EXISTS ${this.fileName.name} (${cloumnsDefinition})`)
        } catch (error) {
            console.log({ error })
        }
    }

    private async insertTableRecords(queryRunner: QueryRunner) {
        try {
            for (const r of this.csvDataFile.records) {
                try {
                    await queryRunner.query(`
                        INSERT INTO ${this.fileName.name} (${this.csvDataFile.columns.join(', ')})
                        VALUES (${r.map(value => (typeof value == 'string' && value.includes("'") ? `'${value.replace(/'/g, '')}'` : `'${value}'`)).join(', ')}
                        );`)
                } catch (error) {
                    throw Error(`An error occurred while saving new ${this.fileName.name} [${JSON.stringify(r.join(', '))}]`)
                }

            }
        } catch (error) {
            console.log(error)
        }
    }

    public async down() { }
}