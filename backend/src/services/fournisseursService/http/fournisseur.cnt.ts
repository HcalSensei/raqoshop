import { mysqlHelper } from '../../../core/db';
import { query } from '../../model';
import { v4 as uuidv4 } from 'uuid';
import { FournisseurI } from './fournisseur.interface';

export class FournisseurController {
    static async create(fournisseur: FournisseurI): Promise<any> {
        return new Promise(async (resolve, reject) => {
            try {
                const id_fournisseurs = uuidv4();
                const connexion = await mysqlHelper.connect();

                // Assuming table 'fournisseurs' exists regarding the plural naming in interface
                const sql = 'INSERT INTO fournisseurs(id_fournisseurs, nom_fournisseurs, contact_fournisseurs, mail_fournisseurs, statutFournisseurs, createdAt, modifyAt) VALUES (?,?,?,?,?,NOW(),NOW())';

                let result = await query(connexion, sql, [
                    id_fournisseurs,
                    fournisseur.nom_fournisseurs,
                    fournisseur.contact_fournisseurs,
                    fournisseur.mail_fournisseurs,
                    fournisseur.statutFournisseurs
                ]);

                result.data.id_fournisseurs = id_fournisseurs;
                connexion.end();
                resolve({ status: 200, error: false, message: "Ajout d'un nouveau fournisseur", data: result.data });
            } catch (error) {
                console.warn(error);
                return reject({ error: true, status: 500, message: "Une erreur interne s'est produite lors de la création du fournisseur", data: error });
            }
        });
    }

    static async update(fournisseur: FournisseurI, id_fournisseurs: string): Promise<any> {
        return new Promise(async (resolve, reject) => {
            try {
                const connexion = await mysqlHelper.connect();
                const sql = 'UPDATE fournisseurs SET nom_fournisseurs=?, contact_fournisseurs=?, mail_fournisseurs=?, statutFournisseurs=?, modifyAt=NOW() WHERE id_fournisseurs=?';
                const result = await query(connexion, sql, [
                    fournisseur.nom_fournisseurs,
                    fournisseur.contact_fournisseurs,
                    fournisseur.mail_fournisseurs,
                    fournisseur.statutFournisseurs,
                    id_fournisseurs
                ]);

                connexion.end();
                resolve({ status: 200, error: false, message: "Fournisseur modifié", data: result.data });
            } catch (error) {
                console.warn(error);
                return reject({ error: true, status: 500, message: "Une erreur interne s'est produite lors de la modification du fournisseur", data: error });
            }
        });
    }

    static async getAll(): Promise<any> {
        return new Promise(async (resolve, reject) => {
            try {
                const connexion = await mysqlHelper.connect();
                const sql = 'SELECT * FROM fournisseurs ORDER BY createdAt DESC';
                const result = await query(connexion, sql, []);
                connexion.end();
                resolve({ status: 200, error: false, message: "Liste des fournisseurs", data: result.data });
            } catch (error) {
                console.warn(error);
                return reject({ error: true, status: 500, message: "Une erreur interne s'est produite lors de la récupération des fournisseurs", data: error });
            }
        });
    }

    static async getOne(id_fournisseurs: string): Promise<any> {
        return new Promise(async (resolve, reject) => {
            try {
                const connexion = await mysqlHelper.connect();
                const sql = 'SELECT * FROM fournisseurs WHERE id_fournisseurs=?';
                const result = await query(connexion, sql, [id_fournisseurs]);
                connexion.end();
                resolve({ status: 200, error: false, message: "Détails du fournisseur", data: result.data });
            } catch (error) {
                console.warn(error);
                return reject({ error: true, status: 500, message: "Une erreur interne s'est produite lors de la récupération du fournisseur", data: error });
            }
        });
    }

    static async activateDeactivate(id_fournisseurs: string, statutFournisseurs: string): Promise<any> {
        return new Promise(async (resolve, reject) => {
            try {
                const connexion = await mysqlHelper.connect();
                const sql = 'UPDATE fournisseurs SET statutFournisseurs=?, modifyAt=NOW() WHERE id_fournisseurs=?';
                const result = await query(connexion, sql, [
                    statutFournisseurs,
                    id_fournisseurs
                ]);
                connexion.end();
                resolve({ status: 200, error: false, message: "Statut du fournisseur mis à jour", data: result.data });
            } catch (error) {
                console.warn(error);
                return reject({ error: true, status: 500, message: "Une erreur interne s'est produite lors de la mise à jour du statut", data: error });
            }
        });
    }
}
