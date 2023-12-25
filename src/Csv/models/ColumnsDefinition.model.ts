export class ColumnDefinition {
    private columns: string[]

    constructor(csv: string[][]) {
        this.columnsDefinition(csv)
    }

    public getColumns(): string[] {
        return this.columns
    }

    private columnsDefinition(csv: string[][]): void {
        this.columns = csv[0]
    }
}