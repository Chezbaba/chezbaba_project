import { Prisma } from "@prisma/client";

export function isMySQL(): boolean {
    return process.env.DATABASE_URL?.includes("mysql") ?? false;
}

export function containsFilter(value: string) {
    return isMySQL()
        ? { contains: value }
        : { contains: value, mode: Prisma.QueryMode.insensitive };
}
