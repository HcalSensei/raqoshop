import { Router, Request, Response } from 'express';
import { routeDecorator } from '../../../core/router';
import { cdg, ValidatorMiddleware } from '../../../utils';
import { LivraisonController, LivraisonMiddleware } from '../http';

class Livraison {
    app: any;
    constructor(app: any) {
        this.app = new app();
    }
    getRoutes() {
        this.app.get(
            '/livraisons',
            async (req: Request, res: Response) => {
                return cdg.api(res, LivraisonController.getAll());
            }
        );

        this.app.post(
            '/add-livraison',
            LivraisonMiddleware.register(),
            ValidatorMiddleware.validate,
            async (req: Request, res: Response) => {
                return cdg.api(res, LivraisonController.create(req.body));
            }
        );

        this.app.post(
            '/update-livraison/:id_livraison',
            async (req: Request, res: Response) => {
                return cdg.api(res, LivraisonController.update(req.body, req.params.id_livraison));
            }
        );

        this.app.get(
            '/livraison/:id',
            async (req: Request, res: Response) => {
                return cdg.api(res, LivraisonController.getOne(req.params.id));
            }
        );

        this.app.post(
            '/update-statut-livraison/:id_livraison',
            async (req: Request, res: Response) => {
                return cdg.api(res, LivraisonController.updateStatus(req.params.id_livraison, req.body.statut));
            }
        );

        return this.app;
    }
}

const route = new Livraison(Router).getRoutes();

export class LivraisonRoute {
    @routeDecorator(route)
    static router: any;
    constructor() {
        //
    }
}
