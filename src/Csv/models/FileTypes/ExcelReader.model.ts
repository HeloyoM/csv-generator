import { IFileReader } from '../../interface/IFileReader.interface'
import * as ExcelJS from 'exceljs'

export class ExcelReader implements IFileReader {

    async readRecords(file: string): Promise<any[]> {
        const workbook = new ExcelJS.Workbook()

        await workbook.xlsx.readFile(file)

        const worksheet = workbook.getWorksheet(1)

        return worksheet.getSheetValues().slice(1)
    }
}