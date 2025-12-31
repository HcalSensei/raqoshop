export interface ArticleI {
    id_article: string;
    reference: string;
    codeBar: string;
    nom: string;
    prix: number; // decimal in DB, number in TS
    statutArticle: string;
    id_fournisseurs: string;
    createdAt: string;
    modifyAt: string;
}
