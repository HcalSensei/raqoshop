import { mysqlHelper } from '../../../core/db';
import { query } from '../../model';
import { v4 as uuidv4 } from 'uuid';
import { Livraison } from './livraison.interface';

export class LivraisonController {
    static async create(livraison: Livraison): Promise<any> {
        return new Promise(async (resolve, reject) => {
            try {
                const id_livraison = uuidv4();
                const connexion = await mysqlHelper.connect();

                const sql = 'INSERT INTO livraison(id_livraison, id_commande, mode_livraison, statut, id_livreur, adresse_livraison, date_recup_commande, date_livre_commande, createdAt, modifyAt) VALUES (?,?,?,?,?,?,?,?,NOW(),NOW())';

                let result = await query(connexion, sql, [
                    id_livraison,
                    livraison.id_commande,
                    livraison.mode_livraison,
                    livraison.statut,
                    livraison.id_livreur,
                    livraison.adresse_livraison,
                    livraison.date_recup_commande,
                    livraison.date_livre_commande
                ]);

                result.data.id_livraison = id_livraison;
                connexion.end();
                resolve({ status: 200, error: false, message: "Ajout d'une nouvelle livraison", data: result.data });
            } catch (error) {
                console.warn(error);
                return reject({ error: true, status: 500, message: "Une erreur interne s'est produite lors de la création de la livraison", data: error });
            }
        });
    }

    static async update(livraison: Livraison, id_livraison: string): Promise<any> {
        return new Promise(async (resolve, reject) => {
            try {
                const connexion = await mysqlHelper.connect();
                const sql = 'UPDATE livraison SET id_commande=?, mode_livraison=?, statut=?, id_livreur=?, adresse_livraison=?, date_recup_commande=?, date_livre_commande=?, modifyAt=NOW() WHERE id_livraison=?';
                const result = await query(connexion, sql, [
                    livraison.id_commande,
                    livraison.mode_livraison,
                    livraison.statut,
                    livraison.id_livreur,
                    livraison.adresse_livraison,
                    livraison.date_recup_commande,
                    livraison.date_livre_commande,
                    id_livraison
                ]);

                connexion.end();
                resolve({ status: 200, error: false, message: "Livraison modifiée", data: result.data });
            } catch (error) {
                console.warn(error);
                return reject({ error: true, status: 500, message: "Une erreur interne s'est produite lors de la modification de la livraison", data: error });
            }
        });
    }

    static async getAll(): Promise<any> {
        return new Promise(async (resolve, reject) => {
            try {
                const connexion = await mysqlHelper.connect();
                const sql = 'SELECT * FROM livraison ORDER BY createdAt DESC';
                const result = await query(connexion, sql, []);
                connexion.end();
                resolve({ status: 200, error: false, message: "Liste des livraisons", data: result.data });
            } catch (error) {
                console.warn(error);
                return reject({ error: true, status: 500, message: "Une erreur interne s'est produite lors de la récupération des livraisons", data: error });
            }
        });
    }

    static async getOne(id_livraison: string): Promise<any> {
        return new Promise(async (resolve, reject) => {
            try {
                const connexion = await mysqlHelper.connect();
                const sql = 'SELECT * FROM livraison WHERE id_livraison=?';
                const result = await query(connexion, sql, [id_livraison]);
                connexion.end();
                resolve({ status: 200, error: false, message: "Détails de la livraison", data: result.data });
            } catch (error) {
                console.warn(error);
                return reject({ error: true, status: 500, message: "Une erreur interne s'est produite lors de la récupération de la livraison", data: error });
            }
        });
    }

    static async updateStatus(id_livraison: string, statut: string): Promise<any> {
        return new Promise(async (resolve, reject) => {
            try {
                const connexion = await mysqlHelper.connect();
                const sql = 'UPDATE livraison SET statut=?, modifyAt=NOW() WHERE id_livraison=?';
                const result = await query(connexion, sql, [
                    statut,
                    id_livraison
                ]);
                connexion.end();
                resolve({ status: 200, error: false, message: "Statut de la livraison mis à jour", data: result.data });
            } catch (error) {
                console.warn(error);
                return reject({ error: true, status: 500, message: "Une erreur interne s'est produite lors de la mise à jour du statut", data: error });
            }
        });
    }
}
