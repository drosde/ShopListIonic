import { ItemList } from "./item";

export interface Lista {
    title: string,
    content: ItemList[],
    note: string,
    total:number,
    date: string
}