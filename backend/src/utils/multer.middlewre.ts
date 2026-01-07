import multer from "multer";
import path, { resolve } from "path"
import fs from "fs";
import { readFileSync, writeFileSync } from 'fs';
import mime from "mime-types"
import { cdg } from "./coddyger";
import { config } from "./config";
import { error } from "console";

interface File {
    path: string,
    mimetype: string,
    filename: string,
    originalname: string,
    encoding: string,
    destination: string,
    size: number,
}

export class MulterMiddleware {
    static uploadPathTmp: any = path.join(/*cdg.root() +*/"" + process.env.UPLOAD_TMP_PATH)
    static uploadPath: any = path.join(/*cdg.root() +*/"" + process.env.UPLOAD_PATH);
    static uploadGalleryImagePath: any = path.join(/*cdg.root() +*/"" + process.env.UPLOAD_GALLERY_IMAGE);
    static uploadVideoPath: any = path.join("" + process.env.UPLOAD_GALLERY_VIDEO)
    static host: any = config.serverhost + ":" + config.serverport;


    static async single(req: any, res: any, next: any) {

        await MulterMiddleware.buildUploadPath();
        let allowedExtension = ['png', 'jpeg', 'jpg', 'gif', 'PNG', 'JPEG', 'JPG', 'GIF'];
        const upload = multer({
            dest: MulterMiddleware.uploadPathTmp,
            fileFilter: (req: any, file: any, cb: any) => {
                if (!cdg.inArray(MulterMiddleware.buildExt(file.mimetype), allowedExtension)) {
                    req.fileValidationError = 'Type de fichier non autorisé';
                    return cdg.api(res, new Promise((resolve) => {
                        resolve({
                            status: 422,
                            message: 'error',
                            data: cdg.buildApiError({ msg: 'Type de fichier non autorisé' })
                        });
                    }));
                }
                cb(null, true);
            }
        }).single("file");

        upload(req, res, function (err: any) {
            if (req.file) {
                if (err instanceof multer.MulterError) {
                    if (err.code === 'LIMIT_FILE_SIZE') {
                        err.message = "Fichier trop volumineux"
                    } else if (err.code === 'LIMIT_FILE_COUNT') {
                        err.message = "Nombre maximum de fichier atteint"
                    }
                    return cdg.api(res, new Promise((resolve) => {
                        resolve({
                            status: 401,
                            message: 'error',
                            data: cdg.buildApiError({ msg: [err] })
                        });
                    }));
                } else if (req.fileValidationError) {
                    return cdg.api(res, new Promise((resolve) => {
                        resolve({
                            status: 401,
                            message: 'error',
                            data: cdg.buildApiError({ msg: req.fileValidationError })
                        });
                    }));
                } else if (err) {
                    return cdg.api(res, new Promise((resolve) => {
                        resolve({
                            status: 401,
                            message: 'error',
                            data: cdg.buildApiError({ msg: err.message })
                        });
                    }));
                }
            } else {
                req.file = '';
            }

            next()
        })
    }

    static async singleVideo(req: any, res: any, next: any) {

        await MulterMiddleware.buildUploadPath();
        let allowedExtension = ['mp4', 'avi', 'mov', 'wmv', 'mkv', 'MP4', 'AVI', 'MOV', 'WMV', 'MKV'];
        const upload = multer({
            dest: MulterMiddleware.uploadPathTmp,
            fileFilter: (req: any, file: any, cb: any) => {
                if (!cdg.inArray(MulterMiddleware.buildExt(file.mimetype), allowedExtension)) {
                    req.fileValidationError = 'Type de fichier non autorisé';
                    return cdg.api(res, new Promise((resolve) => {
                        resolve({
                            status: 422,
                            message: 'error',
                            data: cdg.buildApiError({ msg: 'Type de fichier non autorisé' })
                        });
                    }));
                }
                cb(null, true);
            }
        }).single("file");

        upload(req, res, function (err: any) {
            if (req.file) {
                if (err instanceof multer.MulterError) {
                    if (err.code === 'LIMIT_FILE_SIZE') {
                        err.message = "Fichier trop volumineux"
                    } else if (err.code === 'LIMIT_FILE_COUNT') {
                        err.message = "Nombre maximum de fichier atteint"
                    }
                    return cdg.api(res, new Promise((resolve) => {
                        resolve({
                            status: 401,
                            message: 'error',
                            data: cdg.buildApiError({ msg: [err] })
                        });
                    }));
                } else if (req.fileValidationError) {
                    return cdg.api(res, new Promise((resolve) => {
                        resolve({
                            status: 401,
                            message: 'error',
                            data: cdg.buildApiError({ msg: req.fileValidationError })
                        });
                    }));
                } else if (err) {
                    return cdg.api(res, new Promise((resolve) => {
                        resolve({
                            status: 401,
                            message: 'error',
                            data: cdg.buildApiError({ msg: err.message })
                        });
                    }));
                }
            } else {
                req.file = '';
            }

            next()
        })
    }

    static async multipleVideo(req: any, res: any, next: any) {
        await MulterMiddleware.buildUploadPath();
        let allowedExtension = ['mp4', 'avi', 'mov', 'wmv', 'mkv', 'MP4', 'AVI', 'MOV', 'WMV', 'MKV'];
        const upload = multer({
            dest: MulterMiddleware.uploadPathTmp,
            fileFilter: (req: any, file: any, cb: any) => {
                if (!cdg.inArray(MulterMiddleware.buildExt(file.mimetype), allowedExtension)) {
                    req.fileValidationError = 'Type de fichier non autorisé';
                    return cdg.api(res, new Promise((resolve) => {
                        resolve({
                            status: 422,
                            message: 'error',
                            data: cdg.buildApiError({ msg: 'Type de fichier non autorisé' })
                        });
                    }));
                }
                cb(null, true);
            }
        }).array("files", 10); // Accepts up to 10 files in the "files" field

        upload(req, res, function (err: any) {
            if (err instanceof multer.MulterError) {
                if (err.code === 'LIMIT_FILE_SIZE') {
                    err.message = "Fichier trop volumineux"
                } else if (err.code === 'LIMIT_FILE_COUNT') {
                    err.message = "Nombre maximum de fichier atteint"
                }
                return cdg.api(res, new Promise((resolve) => {
                    resolve({
                        status: 401,
                        message: 'error',
                        data: cdg.buildApiError({ msg: [err] })
                    });
                }));
            } else if (req.fileValidationError) {
                return cdg.api(res, new Promise((resolve) => {
                    resolve({
                        status: 401,
                        message: 'error',
                        data: cdg.buildApiError({ msg: req.fileValidationError })
                    });
                }));
            } else if (err) {
                return cdg.api(res, new Promise((resolve) => {
                    resolve({
                        status: 401,
                        message: 'error',
                        data: cdg.buildApiError({ msg: err.message })
                    });
                }));
            }

            next();
        })
    }

    static async multiple(req: any, res: any, next: any) {
        await MulterMiddleware.buildUploadPath();
        let allowedExtension = ['png', 'jpeg', 'jpg', 'gif', 'PNG', 'JPEG', 'JPG', 'GIF'];
        const upload = multer({
            dest: MulterMiddleware.uploadPathTmp,
            fileFilter: (req: any, file: any, cb: any) => {
                if (!cdg.inArray(MulterMiddleware.buildExt(file.mimetype), allowedExtension)) {
                    req.fileValidationError = 'Type de fichier non autorisé';
                    return cdg.api(res, new Promise((resolve) => {
                        resolve({
                            error: true,
                            status: 422,
                            message: 'error',
                            data: cdg.buildApiError({ msg: 'Type de fichier non autorisé' })
                        });
                    }));
                }
                cb(null, true);
            }
        }).array("files", 10); // Accepts up to 10 files in the "files" field

        upload(req, res, function (err: any) {
            if (err instanceof multer.MulterError) {
                if (err.code === 'LIMIT_FILE_SIZE') {
                    err.message = "Fichier trop volumineux"
                } else if (err.code === 'LIMIT_FILE_COUNT') {
                    err.message = "Nombre maximum de fichier atteint"
                }
                return cdg.api(res, new Promise((resolve) => {
                    resolve({
                        error: true,
                        status: 401,
                        message: 'error',
                        data: cdg.buildApiError({ msg: [err] })
                    });
                }));
            } else if (req.fileValidationError) {
                return cdg.api(res, new Promise((resolve) => {
                    resolve({
                        error: true,
                        status: 401,
                        message: 'error',
                        data: cdg.buildApiError({ msg: req.fileValidationError })
                    });
                }));
            } else if (err) {
                return cdg.api(res, new Promise((resolve) => {
                    resolve({
                        error: true,
                        status: 401,
                        message: 'error',
                        data: cdg.buildApiError({ msg: err.message })
                    });
                }));
            }

            next();
        })
    }

    static async saveMultiple(files: File[], destination: any): Promise<any> {
        return new Promise(async (resolve, reject) => {
            try {
                let results: any = [];

                if (!fs.existsSync(destination)) {
                    await fs.promises.mkdir(destination, { recursive: true })
                }
                for (let file of files) {
                    const tempPath = file.path;
                    let destinationPath = destination ? destination : MulterMiddleware.uploadPath;
                    let fileExt = MulterMiddleware.buildExt(file.mimetype);
                    let fullFilePath = destinationPath + "/" + file.filename + "-" + cdg.getDate() + '.' + fileExt;

                    fs.renameSync(tempPath, fullFilePath);
                    if (cdg.file.exists(tempPath)) {
                        fs.rmdirSync(tempPath);
                    }

                    fullFilePath = path.join(destinationPath + "/" + file.filename + "-" + cdg.getDate() + '.' + fileExt)
                    results.push(fullFilePath);
                }

                return resolve({ error: false, status: 302, message: "Images envoyées.", data: results });
            } catch (error) {
                return reject({ error: true, status: 500, message: "💀☠💀Une erreur interne s'est produite❗❗❗💀☠💀", data: null })
            }
        })
    }
    static async deleteOneFile(fullPath: string): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            try {
                const correctPath = fullPath.replace(/\\/g, "/")
                if (!fs.existsSync(correctPath))
                    return resolve({ error: true, message: "💀☠💀Mauvais chemin❗❗❗💀☠💀", data: null })
                const result = fs.unlinkSync(`./${correctPath}`)
                return resolve({ error: false, message: "Images supprimer.", data: result });
            } catch (error) {
                return reject({ error: true, message: "💀☠💀Une erreur interne s'est produite❗❗❗💀☠💀", data: error })
            }
        })
    }

    static async save(file: File, destination: string | null): Promise<any> {
        return new Promise((resolve, reject) => {
            try {

                const tempPath = file.path;
                let destinationPath: any = null
                if (!destination) {
                    destinationPath = MulterMiddleware.uploadPath
                }
                else {
                    destinationPath = destination
                }


                let fileExt = MulterMiddleware.buildExt(file.mimetype);
                let fullFilePath = destinationPath + "/" + file.filename + "-" + cdg.getDate() + '.' + fileExt;

                fs.rename(tempPath, fullFilePath, err => {
                    if (err) reject({ status: 1, data: err });

                    if (cdg.file.exists(tempPath)) {
                        fs.rmdirSync(tempPath);
                    }
                    fullFilePath = path.join(destinationPath + "/" + file.filename + "-" + cdg.getDate() + '.' + fileExt)

                    return resolve({ error: false, status: 302, message: "Image envoyé.", data: fullFilePath })
                });
            } catch (error) {
                return reject({ error: true, status: 500, message: "💀☠💀Une erreur interne s'est produite❗❗❗💀☠💀", data: null })
            }
        })
    }

    static buildExt(mimetype: string) {
        return mime.extension(mimetype);
    }

    static async syncWriteEtiquetteFile(filename: string, data: any) {
        /**
        * flags:
        *  - w = Open file for reading and writing. File is created if not exists
        *  - a+ = Open file for reading and appending. The file is created if not exists
        */

        writeFileSync(path.join(this.uploadPath, filename), data, {
            flag: 'w',
        });
    }

    static async buildUploadPath() {
        // CREATE TEMPORY UPLOAD PATH
        if (!fs.existsSync(this.uploadPathTmp)) {
            await fs.promises.mkdir(this.uploadPathTmp, { recursive: true })
        }
        // CREATE UPLOAD PATH
        if (!fs.existsSync(this.uploadPath)) {
            await fs.promises.mkdir(this.uploadPath, { recursive: true })
        }
        // CREATE UPLOAD PATH
        if (!fs.existsSync(this.uploadGalleryImagePath)) {
            await fs.promises.mkdir(this.uploadGalleryImagePath, { recursive: true })
        }

        if (!fs.existsSync(this.uploadVideoPath)) {
            await fs.promises.mkdir(this.uploadVideoPath, { recursive: true })

        }
    }
}