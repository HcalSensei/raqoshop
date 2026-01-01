import { NextFunction, Request, Response } from 'express';
import { body } from 'express-validator';
import { mysqlHelper } from '../../../core/db'
import { query } from '../../model'
import { cdg } from '../../../utils'

export class StockMiddleware {
    static register() {
        return [
            body('id_article').notEmpty().withMessage("L'id article est obligatoire"),
            body('quantite').notEmpty().withMessage('La quantité est obligatoire').isNumeric().withMessage('La quantité doit être un nombre'),
            body('lieu_entreposer').notEmpty().withMessage('Le lieu est obligatoire'),
            body('statutStock').notEmpty().withMessage('Le statut stock est obligatoire')
        ]
    }
}
