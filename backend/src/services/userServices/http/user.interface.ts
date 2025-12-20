export interface userBoutiqueI{
    id_utilisateur : string
    ,nom: string
    // , prenoms: string
    , login: string
    , mot_de_passe: string
    ,statutUser: string
    , createdAt: string
    , modifyAt: string
    // ,userPhoto: string,
    // viewAccess: number,
    // createAccess: number,
    // updateAccess: number,
    // deleteAccess: number
   
}

export interface roleI{
    id_role : string,
    libelle : string,
    description : string,
    createdAt : string,
    modifyAt : string,
    statutRole : string
}

export interface utilisateurRoleI{
    // id_utilisateur_role : string,
    id_utilisateur : string,
    id_role : string,
    createdAt : string,
    modifyAt : string,
    statutUtilisateurRole : number
}