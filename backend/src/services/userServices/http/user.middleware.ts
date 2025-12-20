import { NextFunction, Request, Response } from 'express';
import { body } from 'express-validator';
import {mysqlHelper} from '../../../core/db'
import {query} from '../../model'
import {cdg} from '../../../utils'

export class UserMiddleware{
    static register(){
        return [
            body('nom').notEmpty().withMessage('Le nom est obligatoire'),
            body('login').notEmpty().withMessage('Le login est obligatoire'),
            body('mot_de_passe').notEmpty().withMessage('Le mot de passe est obligatoire'),
            body('statutUser').isInt({min:0, max:1}).withMessage('Le statut utilisateur doit être 0 ou 1')
        ]
    }

    static async verifyUniqueLogin(req: Request, res: Response, next: NextFunction){
        const {login} = req.body;
        try {
            const connexion = await mysqlHelper.connect();
            const sql = 'SELECT * FROM utilisateur WHERE login = ?';
            const users = await query(connexion, sql, [login]);
            if(users.data.length > 0){
                    return cdg.api(res, Promise.resolve({
                    status: 422,
                    message: "Veuillez renseigner le champs: mail",
                    data: null,
                    error: true
                }));
            }
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