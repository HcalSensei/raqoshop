export interface OrderI {
    id_commande: string;
    reference: string;
    date_commande: string;
    status: string;
    montant_total: number;
    type_commande: string;
    client: string;
    items: any[];
}