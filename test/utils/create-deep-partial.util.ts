import { DeepPartial } from "typeorm";

export function createDeepPartial<T>(obj: DeepPartial<T>): T {
    return obj as T;
}