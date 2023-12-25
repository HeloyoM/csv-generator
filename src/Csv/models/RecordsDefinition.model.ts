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
        
        this.records = recordsArray.map((d) => this.appropriateElementsType(d))
    }

    private appropriateElementsType(arr: any[]): any[] {
        const convertedArray = arr.map(element => {
            const convertedElement = !isNaN(element) ? parseFloat(element) : element

            return convertedElement
        })

        return convertedArray
    }
}