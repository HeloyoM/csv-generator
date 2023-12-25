import { ColumnDefinition } from "./ColumnsDefinition.model"
import { QueryStringGenerator } from "./QueryStringGenerator.model"
import { RecordsDefinition } from "./RecordsDefinition.model"

export class FileProcessor {
    private columnDefinition: ColumnDefinition
    private recordsDefinition: RecordsDefinition
    private queryStringGenerator: QueryStringGenerator

    constructor(recordsString: string[][]) {
        this.columnDefinition = new ColumnDefinition(recordsString)
        this.recordsDefinition = new RecordsDefinition(recordsString)
        this.queryStringGenerator = new QueryStringGenerator(
            this.columnDefinition.getColumns(),
            this.recordsDefinition.getRecords()
        )
    }

    public getColumns(): string[] {
        return this.columnDefinition.getColumns()
    }

    public getRecords(): string[][] {
        return this.recordsDefinition.getRecords()
    }

    public getQuery(): string {
        return this.queryStringGenerator.getQuery()
    }

}