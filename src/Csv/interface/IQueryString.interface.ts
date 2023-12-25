export interface IQueryStringGenerator { // 0 Instabllity 
    getQueryString(columns: string[], records: string[][]): string;
}