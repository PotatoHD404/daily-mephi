export interface Repo<T> {
    findOne: (params: Partial<T>) => T;
    find: (params: Partial<T>) => T[];
    add: (dto: Partial<T>) => boolean;
    remove: (params: Partial<T>) => boolean;
    count: (params: Partial<T>) => number;
    findAndCount: (params: Partial<T>) => {count: number, entities: T[]};
    update: (params: Partial<T>) => boolean;
}
