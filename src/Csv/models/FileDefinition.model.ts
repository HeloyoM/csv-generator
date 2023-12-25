import { IFileProcessor } from "../interface/IFileProcessor.interface"
import { FileProcessor } from "./FileProcessor.model"

export class FileDefinition {
    private fileProcessor: IFileProcessor

    constructor(recordsString: string[][], fileProcessor?: IFileProcessor) {
        this.fileProcessor = fileProcessor || new FileProcessor(recordsString)
    }

    public getColumns(): string[] {
        return this.fileProcessor.getColumns()
    }

    public getRecords(): string[][] {
        return this.fileProcessor.getRecords()
    }

    public getQueryString(): string {
        return this.fileProcessor.getQuery()
    }
}