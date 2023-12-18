export function getMySQLCloumns(cloumns: string[], data: any[]) {
    const columnsStringArray: string[] = []

    const t = cloumns.reduce((acc, crr: string, index: number) => {
        const d = data[index]
        let datatype = ''

        if (typeof d === 'number') {

            if (Number.isInteger(d)) {
                if (d >= -128 && d <= 127) {
                    datatype = `TINYINT`
                } else if (d >= -32768 && d <= 32767) {
                    datatype = `SMALLINT`
                } else if (d >= -8388608 && d <= 8388607) {
                    datatype = `MEDIUMINT`
                } else if (d >= -2147483648 && d <= 2147483647) {
                    datatype = `INT`
                } else if (d >= -9223372036854775808 && d <= 9223372036854775807) {
                    datatype = `BIGINT`
                } else {
                    return `Value of ${d} is out of range for MySQL integer types. donsider to convert it to string`
                }
            } else {
                return `double`
            }
        } else if (typeof d === 'boolean') {
            datatype = `boolean`
        } else if (typeof d === 'string') {
            if (isUUID(d)) datatype = `varchar(36)`
            else datatype = `varchar(255)`
        }

        columnsStringArray.push(`${crr} ${datatype} NOT NULL `)
        return { ...acc, [crr]: data[index] }
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