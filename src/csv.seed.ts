import { readFileSync } from "fs"
import * as path from "path"
import { ParsedPath } from "path"
import { convertArrayString, getMySQLCloumns } from "src/utils/datatype"
import { QueryRunner } from "typeorm"

export class CsvSeed {
    private columns: string[]
    private records: string[][]
    private fileName: ParsedPath
    private queryString: string
    private error: string

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
        const file = path.join(__dirname, '../csv-files/hotels.csv')
        const csv = readFileSync(file, 'utf-8')

        const recordsString = csv.toString().split('\r')

        if (!file.trim()) {
            this.error = 'Empty file. Check again csv file location'
        }

        try {
            this.getTableName(file)

            this.columnsDefinition(recordsString)
            this.recordsDefined(recordsString)
        } catch (error) {
            throw Error()
        }
    }

    private getTableName(file: string): void {
        this.fileName = path.parse(file)
    }

    private async columnsDefinition(csv: string[]): Promise<void> {
        this.columns = csv[0].split(',')
    }

    private recordsDefined(csv: string[]) {
        const recordsArray = csv.slice(1, -1)

        const records = recordsArray.map((u) => u.split(","))
        this.records = records.map(d => convertArrayString(d))

        for (const data of this.records) {
            this.queryString = getMySQLCloumns(this.columns, data)
        }
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
            const cloumnsDefinition = this.queryString.split(',').join(',')
            console.log({ cloumnsDefinition })
            await queryRunner.query(`CREATE TABLE IF NOT EXISTS ${this.fileName.name} (${cloumnsDefinition})`)
        } catch (error) {
            console.log({ error })
        }
    }
    private async insertTableRecords(queryRunner: QueryRunner) {
        try {
            for (const r of this.records) {
                try {
                    await queryRunner.query(`
                        INSERT INTO ${this.fileName.name} (${this.columns.join(', ')})
                        VALUES (${r.map(value => (typeof value === 'string' ? `'${value}'` : value)).join(', ')}
                        );`)
                } catch (error) {
                    throw Error(`An error occurred while saving new hotel [${JSON.stringify(r.join(', '))}]`)
                }

            }
        } catch (error) {
            console.log(error)
        }
    }

    public async down() { }
}