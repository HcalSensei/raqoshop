import { NextFunction, Request, Response } from 'express';
import { body } from 'express-validator';
import { mysqlHelper } from '../../../core/db'
import { query } from '../../model'
import { cdg } from '../../../utils'

export class FournisseurMiddleware {
    static register() {
        return [
            body('nom_fournisseurs').notEmpty().withMessage('Le nom est obligatoire'),
            body('contact_fournisseurs').notEmpty().withMessage('Le contact est obligatoire'),
            body('mail_fournisseurs').notEmpty().withMessage('Le mail est obligatoire'),
            body('statutFournisseurs').notEmpty().withMessage('Le statut fournisseur doit être 0 ou 1')
        ]
    }

    static async verifyUniqueFournisseur(req: Request, res: Response, next: NextFunction) {
        const { nom_fournisseurs } = req.body;
        try {
            const connexion = await mysqlHelper.connect();
            const sql = 'SELECT * FROM fournisseurs WHERE nom_fournisseurs = ?';
            const fournisseurs = await query(connexion, sql, [nom_fournisseurs]);
            if (fournisseurs.data.length > 0) {
                return cdg.api(res, Promise.resolve({
                    status: 422,
                    message: "Le fournisseur avec ce nom existe déjà",
                    data: null,
                    error: true
                }));
            }
            connexion.end();
            next();
        } catch (error) {
            return cdg.api(res, Promise.resolve({
                status: 500,
                message: "Une erreur interne s'est produite",
                data: null,
                error: true
            }));
        }
    }
}