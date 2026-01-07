import express, { Router, Request, Response } from 'express';
import path from "path"
import { cdg } from '../../../utils';
import { routeDecorator } from '../../../core/router';
import { utilisateurImageCnt } from '../http';
import { JwtMiddleware, ValidatorMiddleware, MulterMiddleware } from '../../../utils';

export class Image {
    app: any;
    constructor(app: any) { this.app = new app(); }

    getRoutes() {
        this.app.use((req: Request, res: Response, next: Function) => {
            // Set Cross-Origin-Resource-Policy header
            res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
            res.setHeader('Cross-Origin-Opener-Policy', 'cross-origin');
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
            next();
        });

        this.app.put(
            '/image-user/add',
            // JwtMiddleware.checkToken,
            ValidatorMiddleware.validate,
            MulterMiddleware.multiple,
            async (req: Request, res: Response) => {
                const imageUser = req.files ? req.files : [];
                const utilisateurImage: any = {
                    utilisateurId: req.body.utilisateurId,
                    objet_photo: req.body.objet_photo,
                    file_path: req.body.files
                }

                return cdg.api(res, utilisateurImageCnt.add(utilisateurImage, imageUser));
            }
        )

        this.app.get(
            '/image-user',
            // JwtMiddleware.checkToken,
            async (req: Request, res: Response) => {
                return cdg.api(res, utilisateurImageCnt.getAll());
            }
        )

        this.app.use(
            '/src/assets/gallery/:driver/:filename', // Add :filename parameter
            (req: Request, res: Response) => {
                const driver = req.params.driver;
                const filename = req.params.filename;

                const imagePath = path.join(__dirname, '..', '..', '..', 'assets', 'gallery', driver, filename);

                res.sendFile(imagePath, (err) => {
                    if (err) {
                        console.error('Error serving image:', err);
                        res.status(404).send('Image not found');
                    }
                });
            }
        )

        return this.app
    }
}
const route = new Image(Router).getRoutes();

export class ImageRoute {
    @routeDecorator(route)
    static router: any;
    constructor() {
        //
    }
}