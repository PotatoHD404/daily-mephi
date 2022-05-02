export interface IRepo<T> {
    findOne: (params: Partial<T>) => Promise<T>;
    find: (params: Partial<T>) => Promise<T[]>;
    add: (dto: Partial<T>) => Promise<boolean>;
    addAll: (dto: T[]) => Promise<boolean>;
    update: (dto: Partial<T>) => Promise<boolean>;
    updateAll: (dto: Partial<T>[]) => Promise<boolean>;
    remove: (params: Partial<T>) => Promise<boolean>;
    count: (params: Partial<T>) => Promise<number>;
    findAndCount: (params: Partial<T>) => Promise<{ count: number, entities: T[] }>;
}
