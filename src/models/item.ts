export interface ItemList {
    name: string,
    price: {
        raw: number,
        parsed: string
    },
    amount: number,
    agregado?: boolean,
    totalPriceItem: {
        raw: number,
        parsed: string
    }
}