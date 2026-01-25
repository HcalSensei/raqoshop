export interface Livraison {
    id_livraison: string;
    id_commande: string;
    mode_livraison: string;
    statut: string;
    id_livreur: string;
    adresse_livraison: string;
    date_recup_commande: string;
    date_livre_commande: string;
    createdAt: string;
    modifyAt: string;
}