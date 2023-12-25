import { computeMySQLCloumns } from "../../utils/datatype"

export class QueryStringGenerator {
    private queryString: string

    constructor(columns: string[], records: string[][]) {
        this.getQueryString(columns, records)
    }

    public getQuery(): string {
        return this.queryString
    }

    private getQueryString(columns: string[], records: string[][]): void {
        this.queryString = records.map((r) => computeMySQLCloumns(columns, r))[0]
    }
}