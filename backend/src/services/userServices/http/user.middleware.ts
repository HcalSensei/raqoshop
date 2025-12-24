import { NextFunction, Request, Response } from 'express';
import { body } from 'express-validator';
import {mysqlHelper} from '../../../core/db'
import {query} from '../../model'
import {cdg} from '../../../utils'

export class UserMiddleware{
    static register(){
        return [
            body('nom').notEmpty().withMessage('Le nom est obligatoire'),
            // body('login').notEmpty().withMessage('Le login est obligatoire'),
            // body('mot_de_passe').notEmpty().withMessage('Le mot de passe est obligatoire'),
            body('statutUser').notEmpty().withMessage('Le statut utilisateur doit être 0 ou 1')
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
                    message: "L'utilisateur avec ce login existe déjà",
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

    static async velifyRoleExist(req: Request, res: Response, next: NextFunction){
        const {libelle} = req.body;
        try {
            const connexion = await mysqlHelper.connect();
            const sql = 'SELECT * FROM role WHERE libelle = ?';
            const roles = await query(connexion, sql, [libelle]);
            if(roles.data.length > 0){
                    return cdg.api(res, Promise.resolve({
                    status: 422,
                    message: "Le rôle existe déjà",
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

    static async velifyUpdateRoleExist(req: Request, res: Response, next: NextFunction){
        console.log(req.body);
        
        const {libelle} = req.body;
        try {
            const connexion = await mysqlHelper.connect();
            const sql = 'SELECT * FROM role WHERE id_role = ?';
            const roles = await query(connexion, sql, [req.params.id_role]);
            if(roles.data.length === 0){
                    return cdg.api(res, Promise.resolve({
                    status: 422,
                    message: "Le rôle n'existe pas",
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