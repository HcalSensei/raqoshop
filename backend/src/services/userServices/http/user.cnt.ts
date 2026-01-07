import { mysqlHelper } from '../../../core/db'
import { query } from '../../model'
import { cdg, JwtMiddleware, MulterMiddleware } from '../../../utils'
import bcrypt from 'bcrypt'
import path, { resolve } from "path"
import { userBoutiqueI, roleI, utilisateurImageI } from './user.interface'
import { v4 as uuidv4 } from 'uuid';

export class utilisateurController {
    static async create(user: userBoutiqueI): Promise<any> {
        return new Promise(async (resolve, reject) => {

            try {
                // console.log(uuid);
                const userId = uuidv4();
                const connexion = await mysqlHelper.connect()

                const sql = 'INSERT INTO utilisateur(id_utilisateur, nom, email, telephone, numero_CNI, numero_permis, login, mot_de_passe, statutUser, createdAt, modifiyAt) VALUES (?,?,?,?,?,?,?,?,?,NOW(),NOW())';
                let encpass: string | boolean = await cdg.encryptPassword(user.mot_de_passe)
                if (typeof encpass === 'boolean')
                    resolve({ status: 500, error: true, message: "Une erreur interne s'est produite au cryptage du mot de passe", data: null })

                let result = await query(connexion, sql, [
                    userId,
                    user.nom,
                    user.email,
                    user.telephone,
                    user.numero_CNI,
                    user.numero_permis,
                    user.login,
                    encpass,
                    user.statutUser
                ])
                result.data.id_utilisateur = userId
                const sqlRole = 'INSERT INTO utilisateur_role(id_utilisateur, id_role, createdAt, modifyAt, statutUtilisateurRole) VALUES (?,?,NOW(),NOW(),"Actif")';
                const resultRole = await query(connexion, sqlRole, [
                    userId,
                    user.roleid
                ])
                connexion.end()
                resolve({ status: 200, error: false, message: "Ajout d'un nouvel utilisateur", data: result.data })
            } catch (error) {
                console.warn(error);
                return reject({ error: true, status: 500, message: "une erreur interne s'est produite a la creation de l'utilisateur", data: error })
            }
        })

    }

    static async createClient(user: userBoutiqueI): Promise<any> {
        return new Promise(async (resolve, reject) => {

            try {
                // console.log(uuid);
                const userId = uuidv4();
                const connexion = await mysqlHelper.connect()

                const sql = 'INSERT INTO utilisateur(id_utilisateur, nom, email, telephone, numero_CNI, numero_permis, login, mot_de_passe, statutUser, createdAt, modifiyAt) VALUES (?,?,?,?,?,?,?,?,"Actif",NOW(),NOW())';
                let result = await query(connexion, sql, [
                    userId,
                    user.nom,
                    user.email,
                    user.telephone,
                    "",
                    "",
                    "",
                    "",
                ])
                result.data.id_utilisateur = userId
                const sqlRole = 'INSERT INTO utilisateur_role(id_utilisateur, id_role, createdAt, modifyAt, statutUtilisateurRole) VALUES (?,?,NOW(),NOW(),"Actif")';
                const resultRole = await query(connexion, sqlRole, [
                    userId,
                    user.roleid
                ])
                connexion.end()
                resolve({ status: 200, error: false, message: "Ajout d'un nouvel utilisateur", data: result.data })
            } catch (error) {
                console.warn(error);
                return reject({ error: true, status: 500, message: "une erreur interne s'est produite a la creation de l'utilisateur", data: error })
            }
        })

    }

    static async createDriver(user: any): Promise<any> {
        return new Promise(async (resolve, reject) => {
            try {
                const userId = uuidv4();
                const connexion = await mysqlHelper.connect()
                const sqlInsert = 'INSERT INTO utilisateur(id_utilisateur, nom, email, telephone, numero_CNI, numero_permis, login, mot_de_passe, statutUser, createdAt, modifiyAt) VALUES (?,?,?,?,?,?,?,?,"Actif",NOW(),NOW())'
                let result = await query(connexion, sqlInsert, [
                    userId,
                    user.nom,
                    user.email,
                    user.telephone,
                    user.numero_CNI,
                    user.numero_permis,
                    "",
                    "",
                ])
                result.data.id_utilisateur = userId
                const sqlRole = 'INSERT INTO utilisateur_role(id_utilisateur, id_role, createdAt, modifyAt, statutUtilisateurRole) VALUES (?,?,NOW(),NOW(),"Actif")';
                const resultRole = await query(connexion, sqlRole, [
                    userId,
                    user.roleid
                ])
                connexion.end()
                resolve({ status: 200, error: false, message: "Ajout d'un nouvel utilisateur", data: result.data })
            } catch (error) {
                console.warn(error);
                return reject({ error: true, status: 500, message: "une erreur interne s'est produite a la creation de l'utilisateur livreur", data: error })
            }
        })
    }

    static async getAllDriver(): Promise<any> {
        return new Promise(async (resolve, reject) => {
            try {
                const connexion = await mysqlHelper.connect()
                const sql = 'SELECT driver.id_utilisateur,driver.nom, driver.email, driver.telephone, driver.numero_CNI, driver.numero_permis,driver.statutUser, driver.createdAt, driver.modifiyAt,r.libelle FROM utilisateur as driver INNER JOIN utilisateur_role ro ON ro.id_utilisateur = driver.id_utilisateur INNER JOIN role r ON r.id_role = ro.id_role WHERE r.libelle="Livreur"'
                let result = await query(connexion, sql, [])

                // connexion.end()

                // const connexion2 = await mysqlHelper.connect()
                for (let i = 0; i < result.data.length; i++) {
                    const element = result.data[i]
                    const sqlOrder = 'SELECT l.id_livraison, l.id_livreur, l.statut as statutLivraison, l.createdAt as createdAtLivraison, l.modifyAt as modifiyAtLivraison, c.id_commande,c.reference ,c.id_client, c.statut as statutCommande, c.createdAt as createdAtCommande, c.modifiyAt as modifiyAtCommande, c.date_commande, c.type_commande, c.montant_total FROM livraison l INNER JOIN  commande c ON c.id_commande = l.id_commande WHERE l.id_livreur = ? AND c.type_commande = "Livraison"'
                    const order = await query(connexion, sqlOrder, [element.id_utilisateur])
                    element.order = order.data
                }

                for (let i of result.data) {
                    const sqlImage = 'SELECT objet_photo, file_path FROM images WHERE utilisateurId = ?'
                    const image = await query(connexion, sqlImage, [i.id_utilisateur])
                    i.images = image.data
                }
                connexion.end()
                resolve({ status: 200, error: false, message: "Liste des utilisateurs livreurs", data: result.data })
            } catch (error) {
                console.warn(error);
                return reject({ error: true, status: 500, message: "une erreur interne s'est produite a la recuperation de la liste des utilisateurs", data: error })
            }
        })
    }

    static async update(user: userBoutiqueI): Promise<any> {
        return new Promise(async (resolve, reject) => {
            try {
                const connexion = await mysqlHelper.connect()
                let sql = 'UPDATE utilisateur SET nom=?, email=?, telephone=?, numero_CNI=?, numero_permis=?, login=?, statutUser=?, modifiyAt=NOW() WHERE id_utilisateur=?';
                const oneUser = await query(connexion, sql, [
                    user.nom,
                    user.email,
                    user.telephone,
                    user.numero_CNI,
                    user.numero_permis,
                    user.login,
                    user.statutUser,
                    user.id_utilisateur
                ])

                resolve({ status: 200, error: false, message: "utilisateur Modifié", data: oneUser.data })
                connexion.end()
            } catch (error) {
                console.warn(error);
                return reject({ error: true, status: 500, message: "une erreur interne s'est produite a la modification de l'utilisateur", data: error })
            }
        })
    }

    static async getAll(): Promise<any> {
        return new Promise(async (resolve, reject) => {
            try {
                const connexion = await mysqlHelper.connect()
                const sql = 'SELECT nom,email,telephone,numero_CNI,numero_permis,login,statutUser,createdAt,modifiyAt FROM utilisateur'
                const result = await query(connexion, sql, [])
                connexion.end()
                resolve({ status: 200, error: false, message: "Liste des utilisateurs", data: result.data })
            } catch (error) {
                console.warn(error);
                return reject({ error: true, status: 500, message: "une erreur interne s'est produite lors de la récupération des utilisateurs", data: error })
            }
        })
    }

    static async getOne(id_utilisateur: string): Promise<any> {
        return new Promise(async (resolve, reject) => {
            try {
                const connexion = await mysqlHelper.connect()
                const sql = 'SELECT * FROM utilisateur WHERE id_utilisateur=?'
                const result = await query(connexion, sql, [id_utilisateur])
                connexion.end()
                resolve({ status: 200, error: false, message: "Détails de l'utilisateur", data: result.data })
            } catch (error) {
                console.warn(error);
                return reject({ error: true, status: 500, message: "une erreur interne s'est produite lors de la récupération de l'utilisateur", data: error })
            }
        })
    }

    static async getClient(): Promise<any> {
        return new Promise(async (resolve, reject) => {
            try {
                const connexion = await mysqlHelper.connect()
                const sql = 'SELECT utilisateur.id_utilisateur as id_client,utilisateur.nom,utilisateur.email,utilisateur.telephone,utilisateur.statutUser,utilisateur.createdAt, utilisateur.modifiyAt FROM utilisateur INNER JOIN utilisateur_role ON utilisateur.id_utilisateur = utilisateur_role.id_utilisateur INNER JOIN role ON role.id_role = utilisateur_role.id_role WHERE role.libelle="Client"'
                const result = await query(connexion, sql, [])
                connexion.end()
                resolve({ status: 200, error: false, message: "Liste des clients", data: result.data })
            } catch (error) {
                console.warn(error);
                return reject({ error: true, status: 500, message: "une erreur interne s'est produite lors de la récupération des clients", data: error })
            }
        })
    }

    static async login(login: string, mot_de_passe: string): Promise<any> {
        return new Promise(async (resolve, reject) => {
            try {
                const connexion = await mysqlHelper.connect()
                const sql = 'SELECT nom,email,telephone,numero_CNI,numero_permis,login,statutUser,createdAt,modifiyAt,mot_de_passe FROM utilisateur WHERE login = ?';
                const onUtilisateur = await query(connexion, sql, [login]);
                if (onUtilisateur.data.length == 0)
                    resolve({ status: 402, error: true, message: "Email ou mot de passe incorrect", data: null })

                const passwordIsValid = bcrypt.compareSync(mot_de_passe, onUtilisateur.data[0].mot_de_passe)

                if (!passwordIsValid)
                    resolve({ status: 402, error: true, message: "Email ou mot de passe incorrect", data: null })

                delete onUtilisateur.data.mot_de_passe
                const accesstoken = JwtMiddleware.generateToken({
                    login: onUtilisateur.data.login,
                    nom: onUtilisateur.data.nom,
                    email: onUtilisateur.data.email,
                    telephone: onUtilisateur.data.telephone,
                    numero_CNI: onUtilisateur.data.numero_CNI,
                    numero_permis: onUtilisateur.data.numero_permis,
                    statutUser: onUtilisateur.data.statutUser,
                    createdAt: onUtilisateur.data.createdAt,
                    modifiyAt: onUtilisateur.data.modifiyAt
                })
                connexion.end()
                resolve({ status: 200, error: false, message: "Connexion", data: accesstoken.accessToken })

            } catch (error) {
                console.warn(error);
                return reject({ error: true, status: 500, message: "une erreur interne s'est produite lors de la connexion de l'utilisateur", data: error })
            }
        })
    }

    static async activateDeactivate(id_utilisateur: string, statutUser: string): Promise<any> {
        return new Promise(async (resolve, reject) => {
            try {
                const connexion = await mysqlHelper.connect()
                let sql = 'UPDATE utilisateur SET statutUser=?, modifiyAt=NOW() WHERE id_utilisateur=?';
                const oneUser = await query(connexion, sql, [
                    statutUser,
                    id_utilisateur
                ])
                connexion.end()
                resolve({ status: 200, error: false, message: "Utilisateur activé/désactivé", data: oneUser.data })
            } catch (error) {
                console.warn(error);
                return reject({ error: true, status: 500, message: "une erreur interne s'est produite lors de l'activation/désactivation de l'utilisateur", data: error })
            }
        })
    }
}

export class RoleController {
    static async create(role: roleI): Promise<any> {
        return new Promise(async (resolve, reject) => {
            try {
                const roleId = uuidv4();
                const connexion = await mysqlHelper.connect()
                const sql = 'INSERT INTO role(id_role, libelle, description, statutRole, createdAt, modifyAt) VALUES (?,?,?,?,NOW(),NOW())';
                let result = await query(connexion, sql, [
                    roleId,
                    role.libelle,
                    role.description,
                    role.statutRole
                ])
                result.data.id_role = roleId
                connexion.end()
                resolve({ status: 200, error: false, message: "Ajout d'un nouveau role", data: result.data })
            } catch (error) {
                console.warn(error);
                return reject({ error: true, status: 500, message: "une erreur interne s'est produite a la creation du role", data: error })
            }
        })
    }

    static async update(role: roleI): Promise<any> {
        return new Promise(async (resolve, reject) => {
            try {
                const connexion = await mysqlHelper.connect()
                let sql = 'UPDATE role SET libelle=?,description=?,statutRole=?,modifyAt=NOW() WHERE id_role=?';
                const oneRole = await query(connexion, sql, [
                    role.libelle,
                    role.description,
                    role.statutRole,
                    role.id_role
                ])
                connexion.end()
                resolve({ status: 200, error: false, message: "Rôle Modifié", data: oneRole.data })
            } catch (error) {
                console.warn(error);
                return reject({ error: true, status: 500, message: "une erreur interne s'est produite a la modification du rôle", data: error })
            }
        })
    }
    static async getAll(): Promise<any> {
        return new Promise(async (resolve, reject) => {
            try {
                const connexion = await mysqlHelper.connect()
                const sql = 'SELECT id_role,libelle,description,statutRole,createdAt,modifyAt FROM role ORDER BY createdAt DESC'
                const result = await query(connexion, sql, [])
                connexion.end()
                resolve({ status: 200, error: false, message: "Liste des rôles", data: result.data })
            } catch (error) {
                console.warn(error);
                return reject({ error: true, status: 500, message: "une erreur interne s'est produite lors de la récupération des rôles", data: error })
            }
        })
    }

    static async getAllActive(): Promise<any> {
        return new Promise(async (resolve, reject) => {
            try {
                const connexion = await mysqlHelper.connect()
                const sql = 'SELECT id_role,libelle,description,statutRole,createdAt,modifyAt FROM role WHERE statutRole="actif" ORDER BY createdAt DESC'
                const result = await query(connexion, sql, [])
                connexion.end()
                resolve({ status: 200, error: false, message: "Liste des rôles", data: result.data })
            } catch (error) {
                console.warn(error);
                return reject({ error: true, status: 500, message: "une erreur interne s'est produite lors de la récupération des rôles", data: error })
            }
        })
    }
    static async getOne(id_role: string): Promise<any> {
        return new Promise(async (resolve, reject) => {
            try {
                const connexion = await mysqlHelper.connect()
                const sql = 'SELECT id_role,libelle,description,statutRole,createdAt,modifyAt FROM role WHERE id_role=?'
                const result = await query(connexion, sql, [id_role])
                connexion.end()
                resolve({ status: 200, error: false, message: "Rôle récupéré", data: result.data })
            } catch (error) {
                console.warn(error);
                return reject({ error: true, status: 500, message: "une erreur interne s'est produite lors de la récupération du rôle", data: error })
            }
        })
    }
    static async activateDeactivate(id_role: string, statutRole: string): Promise<any> {
        return new Promise(async (resolve, reject) => {
            try {
                const connexion = await mysqlHelper.connect()
                let sql = 'UPDATE role SET statutRole=?, modifyAt=NOW() WHERE id_role=?';
                const oneRole = await query(connexion, sql, [
                    statutRole,
                    id_role
                ])
                connexion.end()
                resolve({ status: 200, error: false, message: "Rôle activé/désactivé", data: oneRole.data })
            } catch (error) {
                console.warn(error);
                return reject({ error: true, status: 500, message: "une erreur interne s'est produite lors de l'activation/désactivation du rôle", data: error })
            }
        })
    }

}

export class UtilisateurRoleController {
    static async assignRole(id_utilisateur: string, id_role: string): Promise<any> {
        return new Promise(async (resolve, reject) => {
            try {
                const connexion = await mysqlHelper.connect()
                const sql = 'INSERT INTO utilisateur_role(id_utilisateur, id_role, createdAt, modifyAt, statutUtilisateurRole) VALUES (?,?,NOW(),NOW(),1)';
                const result = await query(connexion, sql, [
                    id_utilisateur,
                    id_role
                ])
                connexion.end()
                resolve({ status: 200, error: false, message: "Rôle assigné à l'utilisateur", data: result.data })
            } catch (error) {
                console.warn(error);
                return reject({ error: true, status: 500, message: "une erreur interne s'est produite lors de l'assignation du rôle à l'utilisateur", data: error })
            }
        })
    }

    static async assignRoleBase(id_utilisateur: string, id_role: string): Promise<any> {
        return new Promise(async (resolve, reject) => {
            try {

                const connexion = await mysqlHelper.connect()
                const sql = 'INSERT INTO utilisateur_role(id_utilisateur, id_role, createdAt, modifyAt, statutUtilisateurRole) VALUES (?,?,NOW(),NOW(),"Actif")';
                const result = await query(connexion, sql, [
                    id_utilisateur,
                    id_role
                ])
                connexion.end()
                return true;
            } catch (error) {
                console.warn(error);
                return false;
            }
        })
    }

    static async removeRole(id_utilisateur: string, id_role: string): Promise<any> {
        return new Promise(async (resolve, reject) => {
            try {
                const connexion = await mysqlHelper.connect()
                const sql = 'DELETE FROM utilisateur_role WHERE id_utilisateur=? AND id_role=?';
                const result = await query(connexion, sql, [
                    id_utilisateur,
                    id_role
                ])
                connexion.end()
                resolve({ status: 200, error: false, message: "Rôle retiré à l'utilisateur", data: result.data })
            } catch (error) {
                console.warn(error);
                return reject({ error: true, status: 500, message: "une erreur interne s'est produite lors du retrait du rôle à l'utilisateur", data: error })
            }
        })
    }
}

export class utilisateurImageCnt {
    static async add(userImage: any, pathFile: any): Promise<any> {
        return new Promise(async (resolve, reject) => {
            try {
                let saveFilePath: any
                const connexion = await mysqlHelper.connect()
                let sqlUser = 'SELECT nom FROM utilisateur WHERE id_utilisateur=?';
                const user = await query(connexion, sqlUser, [userImage.utilisateurId])

                if (user.data.length === 0) {
                    return resolve({
                        status: 422,
                        message: "L'utilisateur n'exist pas",
                        data: null,
                        error: true
                    });
                }

                if (pathFile.length == 0) {
                    return resolve({
                        status: 422,
                        message: "Aucune image à enregistrer",
                        data: null,
                        error: true
                    });
                }
                let result: any = []
                saveFilePath = await MulterMiddleware.saveMultiple(pathFile, path.join(MulterMiddleware.uploadPath, `${user.data[0].nom}`));
                for (let filePath of saveFilePath.data) {
                    let sql = 'INSERT INTO images(ImagesId,utilisateurId,objet_photo,file_path,createdAt,modifiyAt) VALUES (?,?,?,?,NOW(),NOW())';
                    const queryResult = await query(connexion, sql, [
                        uuidv4(),
                        userImage.utilisateurId,
                        userImage.objet_photo,
                        filePath
                    ])
                    result.push(queryResult.data)
                }
                connexion.end()
                resolve({ status: 200, error: false, message: "Ajout d'une nouvelle image", data: result })
            } catch (error) {
                console.warn(error);
                return reject({ error: true, status: 500, message: "une erreur interne s'est produite a l'ajout de l'image", data: error })
            }
        })
    }

    static async getAll(): Promise<any> {
        return new Promise(async (resolve, reject) => {
            try {
                const connexion = await mysqlHelper.connect()
                const sql = 'SELECT * FROM images'
                const result = await query(connexion, sql, [])
                connexion.end()
                resolve({ status: 200, error: false, message: "Liste des images", data: result.data })
            } catch (error) {
                console.warn(error);
                return reject({ error: true, status: 500, message: "une erreur interne s'est produite lors de la récupération des images", data: error })
            }
        })
    }
}
