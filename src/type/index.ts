export type TGeneralKey = string | number | symbol;

export interface IObj<T = any> {
    [key: TGeneralKey]: T;
}

export type TDataSouceFunction = (requestContext: any, store: any) => any;