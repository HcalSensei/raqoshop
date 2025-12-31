import { mysqlHelper } from '../../../core/db';
import { query } from '../../model';
import { v4 as uuidv4 } from 'uuid';
import { OrderI } from './order.interface';

export class OrderController {
    static async create(order: OrderI): Promise<any> {
        return new Promise(async (resolve, reject) => {
            try {
                const orderId = uuidv4();
                const connexion = await mysqlHelper.connect();

                // Logic to generate reference REFddmmYYYY000
                const now = new Date();
                const day = String(now.getDate()).padStart(2, '0');
                const month = String(now.getMonth() + 1).padStart(2, '0');
                const year = now.getFullYear();
                const prefix = `REF${day}${month}${year}`;

                // Query to find the last order of the day
                const sqlCheck = 'SELECT reference FROM commande WHERE reference LIKE ? ORDER BY reference DESC LIMIT 1';
                const resultCheck = await query(connexion, sqlCheck, [`${prefix}%`]);

                let sequence = '001';
                if (resultCheck.data.length > 0) {
                    const lastReference = resultCheck.data[0].reference;
                    // Extract the sequence number (last 3 digits) and increment
                    const lastSequence = parseInt(lastReference.slice(-3));
                    sequence = String(lastSequence + 1).padStart(3, '0');
                }

                const newReference = `${prefix}${sequence}`;

                const sql = 'INSERT INTO commande(id_commande, reference, date_commande, statut, montant_total, type_commande, createdAt, modifyAt) VALUES (?,?,?,?,?,?,NOW(),NOW())';

                let result = await query(connexion, sql, [
                    orderId,
                    newReference,
                    order.date_commande,
                    order.statut,
                    order.montant_total,
                    order.type_commande
                ]);

                result.data.id_commande = orderId;
                connexion.end();
                resolve({
                    status: 200, error: false, message: "Ajout d'une nouvelle commande", data: {
                        id_commande: orderId,
                        reference: newReference,
                        date_commande: order.date_commande,
                        statut: order.statut,
                        montant_total: order.montant_total,
                        type_commande: order.type_commande
                    }
                });
            } catch (error) {
                console.warn(error);
                return reject({ error: true, status: 500, message: "Une erreur interne s'est produite lors de la création de la commande", data: error });
            }
        });
    }

    static async update(order: OrderI, id_commande: string): Promise<any> {
        return new Promise(async (resolve, reject) => {
            try {
                const connexion = await mysqlHelper.connect();
                const sql = 'UPDATE commande SET reference=?, date_commande=?, statut=?, montant_total=?, type_commande=?, modifyAt=NOW() WHERE id_commande=?';
                const result = await query(connexion, sql, [
                    order.reference,
                    order.date_commande,
                    order.statut,
                    order.montant_total,
                    order.type_commande,
                    id_commande
                ]);

                connexion.end();
                resolve({ status: 200, error: false, message: "Commande modifiée", data: result.data });
            } catch (error) {
                console.warn(error);
                return reject({ error: true, status: 500, message: "Une erreur interne s'est produite lors de la modification de la commande", data: error });
            }
        });
    }

    static async getAll(): Promise<any> {
        return new Promise(async (resolve, reject) => {
            try {
                const connexion = await mysqlHelper.connect();
                const sql = 'SELECT * FROM commande ORDER BY createdAt DESC';
                const result = await query(connexion, sql, []);
                connexion.end();
                resolve({ status: 200, error: false, message: "Liste des commandes", data: result.data });
            } catch (error) {
                console.warn(error);
                return reject({ error: true, status: 500, message: "Une erreur interne s'est produite lors de la récupération des commandes", data: error });
            }
        });
    }

    static async getOne(id_commande: string): Promise<any> {
        return new Promise(async (resolve, reject) => {
            try {
                const connexion = await mysqlHelper.connect();
                const sql = 'SELECT * FROM commande WHERE id_commande=?';
                const result = await query(connexion, sql, [id_commande]);
                connexion.end();
                resolve({ status: 200, error: false, message: "Détails de la commande", data: result.data });
            } catch (error) {
                console.warn(error);
                return reject({ error: true, status: 500, message: "Une erreur interne s'est produite lors de la récupération de la commande", data: error });
            }
        });
    }
}
