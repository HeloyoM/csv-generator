import { IQueryStringGenerator } from "../interface/IQueryString.interface"
import { ColumnDefinition } from "./ColumnsDefinition.model"
import { QueryStringGenerator } from "./QueryStringGenerator.model"
import { RecordsDefinition } from "./RecordsDefinition.model"

export class FileProcessor {
    private columnDefinition: ColumnDefinition
    private recordsDefinition: RecordsDefinition
    private queryStringGenerator: IQueryStringGenerator

    constructor(recordsString: string[][]) {
        this.columnDefinition = new ColumnDefinition(recordsString)
        this.recordsDefinition = new RecordsDefinition(recordsString)
        this.queryStringGenerator = new QueryStringGenerator()
    }

    public getColumns(): string[] {
        return this.columnDefinition.getColumns()
    }

    public getRecords(): string[][] {
        return this.recordsDefinition.getRecords()
    }

    public getQuery(): string {
        return this.queryStringGenerator.getQueryString(
            this.getColumns(),
            this.getRecords()
        )
    }

}