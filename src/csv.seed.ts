import { readFileSync } from "fs"
import * as path from "path"
import { convertArrayString, getMySQLCloumns } from "src/utils/datatype"
import { QueryRunner } from "typeorm"

export class CsvSeed {
    public async up(queryRunner: QueryRunner) {
        const file = path.join(__dirname, '../ csv-files/hotels.csv')

        const fileName = path.parse(file)

        const csv = readFileSync(file, 'utf-8')

        const array = csv.toString().split('\r')

        const columns = array[0].split(',')

        const dataArray = array.slice(1, -1)

        const data = dataArray.map((u) => u.split(","))

        if (!data.length)
            throw Error('CSV file is empty')

        const convertedData = data.map(d => convertArrayString(d))

        let cols = ''
        for (const data of convertedData) {
            cols = getMySQLCloumns(columns, data)
        }
        const result = cols.split(',').join(',');

        try {
            await queryRunner.query(`CREATE TABLE IF NOT EXISTS ${fileName.name} (${result})`)
        } catch (error) {
            console.log(error)
            throw Error(error)
        }
    }

    public async down() { }
}