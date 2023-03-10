export type InnerJoin<T, U> = Pick<T & U, Extract<keyof T, keyof U>>;
