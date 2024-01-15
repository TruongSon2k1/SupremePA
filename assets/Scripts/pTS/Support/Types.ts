
declare type AssertionMode = 'crash' | 'break' | 'warn';
declare type ClassType<T> = {prototype: T}
declare type ConstructClass<T> = new() => T
