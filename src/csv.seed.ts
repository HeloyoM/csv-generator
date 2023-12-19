import { readFileSync } from "fs"
import * as path from "path"
import { ParsedPath } from "path"
import { convertArrayString, getMySQLCloumns } from "src/utils/datatype"
import { QueryRunner } from "typeorm"

export class CsvSeed {
    private columns: string[]
    private array: string[]
    private fileName: ParsedPath

    constructor() {
        this.array = this.getCsvFile()
    }

    public async up(queryRunner: QueryRunner) {

        this.columns = this.array[0].split(',')

        const dataArray = this.array.slice(1, -1)

        const data = dataArray.map((u) => u.split(","))

        if (!data.length)
            throw Error('CSV file is empty')

        const convertedData = data.map(d => convertArrayString(d))

        let cols = ''
        for (const data of convertedData) {
            cols = getMySQLCloumns(this.columns, data)
        }
        const result = cols.split(',').join(',')

        try {
            await queryRunner.query(`CREATE TABLE IF NOT EXISTS ${this.fileName.name} (${result})`)
        } catch (error) {
            throw Error(error)
        }

        await queryRunner.release()
    }

    private getCsvFile(): string[] {
        const file = path.join(__dirname, '../csv-files/hotels.csv') // set location csv-file

        if (!file.trim())
            throw Error('Empty file. Check again csv file location')

        this.fileName = path.parse(file)

        const csv = readFileSync(file, 'utf-8')

        return csv.toString().split('\r')
    }

    public async down() { }
}