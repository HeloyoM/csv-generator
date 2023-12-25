export interface IQueryStringGenerator {
    getQueryString(columns: string[], records: string[][]): string;
}