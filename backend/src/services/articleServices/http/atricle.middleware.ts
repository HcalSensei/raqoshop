import { NextFunction, Request, Response } from 'express';
import { body } from 'express-validator';
import { mysqlHelper } from '../../../core/db'
import { query } from '../../model'
import { cdg } from '../../../utils'

export class ArticleMiddleware {
    static register() {
        return [
            body('reference').notEmpty().withMessage('La reference est obligatoire'),
            body('codeBar').notEmpty().withMessage('Le codebar est obligatoire'),
            body('nom').notEmpty().withMessage('Le nom est obligatoire'),
            body('prix').notEmpty().withMessage('Le prix est obligatoire'),
            body('statutArticle').notEmpty().withMessage('Le statut article est obligatoire')
        ]
    }

    static async verifyUniqueArticle(req: Request, res: Response, next: NextFunction) {
        const { reference, nom } = req.body;
        try {
            const connexion = await mysqlHelper.connect();
            const sql = 'SELECT * FROM article WHERE reference = ? OR nom = ?';
            const articles = await query(connexion, sql, [reference, nom]);
            if (articles.data.length > 0) {
                return cdg.api(res, Promise.resolve({
                    status: 422,
                    message: "L'article avec ce reference ou nom existe deja",
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