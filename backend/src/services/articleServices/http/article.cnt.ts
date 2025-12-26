import { mysqlHelper } from '../../../core/db';
import { query } from '../../model';
import { v4 as uuidv4 } from 'uuid';
import { ArticleI } from './article.interface';

export class ArticleController {
    static async create(article: ArticleI): Promise<any> {
        return new Promise(async (resolve, reject) => {
            try {
                const articleId = uuidv4();
                const connexion = await mysqlHelper.connect();
                // Assuming table 'article' exists with columns matching the interface
                const sql = 'INSERT INTO article(id_article, reference, codeBar, nom, prix, statutArticle, createdAt, modifyAt) VALUES (?,?,?,?,?,?,NOW(),NOW())';

                let result = await query(connexion, sql, [
                    articleId,
                    article.reference,
                    article.codeBar,
                    article.nom,
                    article.prix,
                    article.statutArticle
                ]);

                result.data.id_article = articleId;
                connexion.end();
                resolve({ status: 200, error: false, message: "Ajout d'un nouvel article", data: result.data });
            } catch (error) {
                console.warn(error);
                return reject({ error: true, status: 500, message: "Une erreur interne s'est produite lors de la création de l'article", data: error });
            }
        });
    }

    static async update(article: ArticleI, id_article: string): Promise<any> {
        return new Promise(async (resolve, reject) => {
            try {
                const connexion = await mysqlHelper.connect();
                const sql = 'UPDATE article SET reference=?, codeBar=?, nom=?, prix=?, statutArticle=?, modifyAt=NOW() WHERE id_article=?';
                const result = await query(connexion, sql, [
                    article.reference,
                    article.codeBar,
                    article.nom,
                    article.prix,
                    article.statutArticle,
                ]);

                connexion.end();
                resolve({ status: 200, error: false, message: "Article modifié", data: result.data });
            } catch (error) {
                console.warn(error);
                return reject({ error: true, status: 500, message: "Une erreur interne s'est produite lors de la modification de l'article", data: error });
            }
        });
    }

    static async getAll(): Promise<any> {
        return new Promise(async (resolve, reject) => {
            try {
                const connexion = await mysqlHelper.connect();
                const sql = 'SELECT * FROM article ORDER BY createdAt DESC';
                const result = await query(connexion, sql, []);
                connexion.end();
                resolve({ status: 200, error: false, message: "Liste des articles", data: result.data });
            } catch (error) {
                console.warn(error);
                return reject({ error: true, status: 500, message: "Une erreur interne s'est produite lors de la récupération des articles", data: error });
            }
        });
    }

    static async getOne(id_article: string): Promise<any> {
        return new Promise(async (resolve, reject) => {
            try {
                const connexion = await mysqlHelper.connect();
                const sql = 'SELECT * FROM article WHERE id_article=?';
                const result = await query(connexion, sql, [id_article]);
                connexion.end();
                resolve({ status: 200, error: false, message: "Détails de l'article", data: result.data });
            } catch (error) {
                console.warn(error);
                return reject({ error: true, status: 500, message: "Une erreur interne s'est produite lors de la récupération de l'article", data: error });
            }
        });
    }

    static async activateDeactivate(id_article: string, statutArticle: string): Promise<any> {
        return new Promise(async (resolve, reject) => {
            try {
                const connexion = await mysqlHelper.connect();
                const sql = 'UPDATE article SET statutArticle=?, modifyAt=NOW() WHERE id_article=?';
                const result = await query(connexion, sql, [
                    statutArticle,
                    id_article
                ]);
                connexion.end();
                resolve({ status: 200, error: false, message: "Statut de l'article mis à jour", data: result.data });
            } catch (error) {
                console.warn(error);
                return reject({ error: true, status: 500, message: "Une erreur interne s'est produite lors de la mise à jour du statut", data: error });
            }
        });
    }
}
