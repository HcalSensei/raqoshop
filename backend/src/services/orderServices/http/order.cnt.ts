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

                const sql = 'INSERT INTO commande(id_commande, reference, statut, montant_total, type_commande, id_client, date_commande,createdAt, modifiyAt) VALUES (?,?,?,?,?,?,NOW(),NOW(),NOW())';

                let result = await query(connexion, sql, [
                    orderId,
                    newReference,
                    order.status,
                    order.montant_total,
                    order.type_commande,
                    order.client
                ]);
                const sqlLigneCommande = 'INSERT INTO ligne_commande(id_ligne, id_commande, id_article, quantite, prix_unitaire, createdAt, modifiyAt) VALUES (?,?,?,?,?,NOW(),NOW())';

                for (let i = 0; i < order.items.length; i++) {
                    const ligneCommande = await query(connexion, sqlLigneCommande, [
                        uuidv4(),
                        orderId,
                        order.items[i].id_article,
                        order.items[i].quantity,
                        order.items[i].prix
                    ]);
                }
                result.data.id_commande = orderId;
                connexion.end();
                resolve({
                    status: 200, error: false, message: "Ajout d'une nouvelle commande", data: {
                        id_commande: orderId,
                        reference: newReference,
                        date_commande: order.date_commande,
                        status: order.status,
                        montant_total: order.montant_total,
                        type_commande: order.type_commande,
                        items: order.items
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
                    order.status,
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
                const sql = 'SELECT c.id_commande, c.reference,c.date_commande, c.statut,c.montant_total,c.id_client, c.type_commande, u.nom as client FROM commande c INNER JOIN utilisateur u ON u.id_utilisateur = c.id_client ORDER BY c.createdAt DESC';
                const result = await query(connexion, sql, []);

                const sqlLigneCommande = 'SELECT l.id_ligne, l.id_commande, l.id_article, l.quantite as quantity, l.prix_unitaire as prix,a.nom FROM ligne_commande l INNER JOIN article a ON a.id_article = l.id_article WHERE l.id_commande=?';
                for (let i = 0; i < result.data.length; i++) {
                    const ligneCommande = await query(connexion, sqlLigneCommande, [result.data[i].id_commande]);
                    result.data[i].items = ligneCommande.data;
                }
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
