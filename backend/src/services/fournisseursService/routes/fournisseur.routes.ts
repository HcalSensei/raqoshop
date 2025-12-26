import { Router, Request, Response } from 'express';
import { routeDecorator } from '../../../core/router';
import { cdg, ValidatorMiddleware } from '../../../utils';
import { FournisseurController, FournisseurMiddleware } from '../http';

class Fournisseur {
    app: any;
    constructor(app: any) {
        this.app = new app();
    }
    getRoutes() {
        this.app.get(
            '/fournisseurs',
            async (req: Request, res: Response) => {
                return cdg.api(res, FournisseurController.getAll());
            }
        );

        this.app.post(
            '/add-fournisseur',
            FournisseurMiddleware.register(),
            FournisseurMiddleware.verifyUniqueFournisseur,
            ValidatorMiddleware.validate,
            async (req: Request, res: Response) => {
                return cdg.api(res, FournisseurController.create(req.body));
            }
        );

        this.app.post(
            '/update-fournisseur/:id_fournisseurs',
            async (req: Request, res: Response) => {
                return cdg.api(res, FournisseurController.update(req.body, req.params.id_fournisseurs));
            }
        );

        this.app.get(
            '/fournisseur/:id',
            async (req: Request, res: Response) => {
                return cdg.api(res, FournisseurController.getOne(req.params.id));
            }
        );

        this.app.post(
            '/activate-fournisseur/:id_fournisseurs',
            async (req: Request, res: Response) => {
                return cdg.api(res, FournisseurController.activateDeactivate(req.params.id_fournisseurs, req.body.statutFournisseurs));
            }
        )

        return this.app;
    }
}

const route = new Fournisseur(Router).getRoutes();

export class FournisseurRoute {
    @routeDecorator(route)
    static router: any;
    constructor() {
        //
    }
}
