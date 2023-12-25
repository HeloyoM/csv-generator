import { parse } from 'csv-parse/sync'
import { IFileReader } from '../../interface/IFileReader.interface'
import { readFileSync } from 'fs'

export class CsvReader implements IFileReader {

    async readRecords(file: string): Promise<any[]> {
        const csv = readFileSync(file, 'utf-8')

        return parse(csv)
    }

}