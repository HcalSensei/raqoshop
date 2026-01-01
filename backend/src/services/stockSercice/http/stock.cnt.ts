import { mysqlHelper } from '../../../core/db';
import { query } from '../../model';
import { v4 as uuidv4 } from 'uuid';
import { StockI } from './stock.interfaces';

export class StockController {
    static async create(stock: StockI): Promise<any> {
        return new Promise(async (resolve, reject) => {
            try {
                const stockId = uuidv4();
                const connexion = await mysqlHelper.connect();
                const sql = 'INSERT INTO stock(id_stock, id_article, quantite, lieu_entreposer, statutStock, createdAt, modifyAt) VALUES (?,?,?,?,?,NOW(),NOW())';

                let result = await query(connexion, sql, [
                    stockId,
                    stock.id_article,
                    stock.quantite,
                    stock.lieu_entreposer,
                    stock.statutStock
                ]);

                result.data.id_stock = stockId;
                connexion.end();
                resolve({ status: 200, error: false, message: "Ajout d'un nouveau stock", data: result.data });
            } catch (error) {
                console.warn(error);
                return reject({ error: true, status: 500, message: "Une erreur interne s'est produite lors de la création du stock", data: error });
            }
        });
    }

    static async update(stock: StockI, id_stock: string): Promise<any> {
        return new Promise(async (resolve, reject) => {
            try {
                const connexion = await mysqlHelper.connect();
                const sql = 'UPDATE stock SET quantite=?, lieu_entreposer=?, statutStock=?, modifyAt=NOW() WHERE id_stock=?';
                const result = await query(connexion, sql, [
                    stock.quantite,
                    stock.lieu_entreposer,
                    stock.statutStock,
                    id_stock
                ]);

                connexion.end();
                resolve({ status: 200, error: false, message: "Stock modifié", data: result.data });
            } catch (error) {
                console.warn(error);
                return reject({ error: true, status: 500, message: "Une erreur interne s'est produite lors de la modification du stock", data: error });
            }
        });
    }

    static async getAll(): Promise<any> {
        return new Promise(async (resolve, reject) => {
            try {
                const connexion = await mysqlHelper.connect();
                const sql = 'SELECT * FROM stock ORDER BY createdAt DESC';
                const result = await query(connexion, sql, []);
                connexion.end();
                resolve({ status: 200, error: false, message: "Liste des stocks", data: result.data });
            } catch (error) {
                console.warn(error);
                return reject({ error: true, status: 500, message: "Une erreur interne s'est produite lors de la récupération des stocks", data: error });
            }
        });
    }

    static async getOne(id_stock: string): Promise<any> {
        return new Promise(async (resolve, reject) => {
            try {
                const connexion = await mysqlHelper.connect();
                const sql = 'SELECT * FROM stock WHERE id_stock=?';
                const result = await query(connexion, sql, [id_stock]);
                connexion.end();
                resolve({ status: 200, error: false, message: "Détails du stock", data: result.data });
            } catch (error) {
                console.warn(error);
                return reject({ error: true, status: 500, message: "Une erreur interne s'est produite lors de la récupération du stock", data: error });
            }
        });
    }

    static async activateDeactivate(id_stock: string, statutStock: string): Promise<any> {
        return new Promise(async (resolve, reject) => {
            try {
                const connexion = await mysqlHelper.connect();
                const sql = 'UPDATE stock SET statutStock=?, modifyAt=NOW() WHERE id_stock=?';
                const result = await query(connexion, sql, [
                    statutStock,
                    id_stock
                ]);
                connexion.end();
                resolve({ status: 200, error: false, message: "Statut du stock mis à jour", data: result.data });
            } catch (error) {
                console.warn(error);
                return reject({ error: true, status: 500, message: "Une erreur interne s'est produite lors de la mise à jour du statut", data: error });
            }
        });
    }
}
