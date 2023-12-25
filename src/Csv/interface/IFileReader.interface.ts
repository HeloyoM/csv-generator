export interface IFileReader {
    readRecords(file: string): Promise<any[]>
}