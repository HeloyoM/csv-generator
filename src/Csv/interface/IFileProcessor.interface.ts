export interface IFileProcessor {
    getColumns(): string[]
    getRecords(): string[][]
    getQuery(): string
}