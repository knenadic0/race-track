export type ExclusiveOr<T, U> = T | U extends object ? (keyof T extends never ? U : T) & (keyof U extends never ? T : U) : T | U;
