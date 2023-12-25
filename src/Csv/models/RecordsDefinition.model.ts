import { convertArrayString } from "../../utils/datatype"

export class RecordsDefinition {
    private records: string[][]

    constructor(csv: string[][]) {
        this.recordsDefinition(csv)
    }

    public getRecords(): string[][] {
        return this.records
    }

    private recordsDefinition(csv: string[][]): void {
        const recordsArray = csv.slice(1, -1)
        this.records = recordsArray.map((d) => convertArrayString(d))
    }
}