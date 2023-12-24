export function computeMySQLCloumns(cloumns: string[], data: any[]) {
    const columnsStringArray: string[] = []

    cloumns.reduce((acc, crr: string, index: number) => {
        const d = data[index]
        let datatype = ''

        if (typeof d === 'number') {

            if (Number.isInteger(d)) {
                if (d >= -128 && d <= 2147483647) {
                    datatype = `INT`
                } else if (d >= -9223372036854775808n && d <= 9223372036854775807n) {
                    datatype = `BIGINT`
                } else {
                    return `Value of ${d} is out of range for MySQL integer types. Consider to convert it to string`
                }
            } else {
                datatype = `varchar(255)`
            }
        } else if (typeof d === 'boolean') {
            datatype = `boolean`
        } else if (typeof d === 'string') {
            if (isUUID(d)) datatype = `varchar(36)`

            else datatype = `varchar(255)`
        }

        columnsStringArray.push(`${crr} ${datatype} NOT NULL `)

    }, {})
    return columnsStringArray.join(',\n')
}
export function isUUID(value: string): boolean {
    const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[14][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

    return uuidPattern.test(value)
}

export function convertArrayString(arr: any[]): any[] {
    const convertedArray = arr.map(element => {
        const convertedElement = !isNaN(element) ? parseFloat(element) : element

        return convertedElement
    })

    return convertedArray
}