import { computeMySQLCloumns, convertArrayString } from "./utils/datatype"

export class FileDefinition {
    private columns: string[]
    private records: string[][]
    private queryString: string

    constructor(recordsString: string[]) {
        this.definedEnvtVariables(recordsString)
    }

    public get getColumns(): string[] {
        return this.columns
    }

    public get getRecords(): string[][] {
        return this.records
    }

    public get getQuery(): string {
        return this.queryString
    }

    private async definedEnvtVariables(recordsString: string[]): Promise<void> {
        this.columnsDefinition(recordsString)
        this.recordsDefinition(recordsString)
        this.getQueryString()
    }

    private columnsDefinition(csv: string[]): void {
        this.columns = csv[0].split(',')
    }

    private recordsDefinition(csv: string[]): void {
        const recordsArray = csv.slice(1, -1)
        const records = recordsArray.map((u) => u.split(","))

        this.records = records.map(d => convertArrayString(d))
    }

    public getQueryString(): void {
        [this.queryString] = this.records.map((r) => (computeMySQLCloumns(this.columns, r)))
    }


}
