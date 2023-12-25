import { computeMySQLCloumns } from "../../utils/datatype"
import { IQueryStringGenerator } from "../interface/IQueryString.interface"

export class QueryStringGenerator implements IQueryStringGenerator {
    private queryString: string

    constructor() { }

    public getQueryString(columns: string[], records: string[][]): string {
        return records.map((r) => computeMySQLCloumns(columns, r))[0]
    }

    public getQuery(): string {
        return this.queryString
    }
}