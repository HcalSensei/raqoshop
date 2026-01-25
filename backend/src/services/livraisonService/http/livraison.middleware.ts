import { NextFunction, Request, Response } from 'express';
import { body } from 'express-validator';
import { mysqlHelper } from '../../../core/db';
import { query } from '../../model';
import { cdg } from '../../../utils';

export class LivraisonMiddleware {
    static register() {
        return [
            body('id_commande').notEmpty().withMessage('L\'ID de la commande est obligatoire'),
            body('mode_livraison').notEmpty().withMessage('Le mode de livraison est obligatoire'),
            body('statut').notEmpty().withMessage('Le statut est obligatoire'),
            body('adresse_livraison').notEmpty().withMessage('L\'adresse de livraison est obligatoire'),
            body('date_recup_commande').notEmpty().withMessage('La date de récupération est obligatoire'),
            body('date_livre_commande').notEmpty().withMessage('La date de livraison est obligatoire')
        ];
    }
}
