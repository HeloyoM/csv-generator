export class ColumnDefinition {
    private columns: string[]

    constructor(csv: string[][]) {
        this.columnsDefinition(csv)
    }

    public getColumns(): string[] {
        return this.columns
    }

    private columnsDefinition(csv: string[][]): void {
        const cols = csv[0].map(e => {
            if (e.includes(' ')) return e.replace(/\s+/g, '_').toLowerCase()

            else return e
        })
        this.columns = cols
    }
}