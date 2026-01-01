import { NextFunction, Request, Response } from 'express';
import { body } from 'express-validator';
import { mysqlHelper } from '../../../core/db'
import { query } from '../../model'
import { cdg } from '../../../utils'

export class OrderMiddleware {
    static register() {
        return [
            body('montant_total').notEmpty().withMessage('Le montant total est obligatoire'),
            body('date_commande').notEmpty().withMessage('La date de commande est obligatoire'),
            body('status').notEmpty().withMessage('Le statut est obligatoire')
        ]
    }

    static async verifyUniqueOrder(req: Request, res: Response, next: NextFunction) {
        const { reference } = req.body;
        try {
            const connexion = await mysqlHelper.connect();
            const sql = 'SELECT * FROM commande WHERE reference = ?';
            const orders = await query(connexion, sql, [reference]);
            if (orders.data.length > 0) {
                return cdg.api(res, Promise.resolve({
                    status: 422,
                    message: "La commande avec cette reference existe deja",
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
