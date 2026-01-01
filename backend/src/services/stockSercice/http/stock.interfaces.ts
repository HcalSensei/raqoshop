export interface StockI {
    id_stock: string;
    id_article: string;
    quantite: number; // decimal in DB, number in TS
    lieu_entreposer: string;
    statutStock: string;
    createdAt: string;
    modifyAt: string;
}