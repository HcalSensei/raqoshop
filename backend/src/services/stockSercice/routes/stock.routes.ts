import { Router, Request, Response } from 'express';
import { routeDecorator } from '../../../core/router';
import { cdg, ValidatorMiddleware } from '../../../utils';
import { StockMiddleware, StockController } from '../http'

class Stock {
    app: any;
    constructor(app: any) {
        this.app = new app();
    }
    getRoutes() {
        this.app.get(
            '/stocks',
            async (req: Request, res: Response) => {
                return cdg.api(res, StockController.getAll());
            }
        );

        this.app.post(
            '/add-stock',
            StockMiddleware.register(),
            ValidatorMiddleware.validate,
            async (req: Request, res: Response) => {
                return cdg.api(res, StockController.create(req.body));
            }
        );

        this.app.post(
            '/update-stock/:id_stock',
            async (req: Request, res: Response) => {
                return cdg.api(res, StockController.update(req.body, req.params.id_stock));
            }
        );

        this.app.get(
            '/stock/:id',
            async (req: Request, res: Response) => {
                return cdg.api(res, StockController.getOne(req.params.id));
            }
        );

        this.app.post(
            '/activate-stock/:id_stock',
            async (req: Request, res: Response) => {
                return cdg.api(res, StockController.activateDeactivate(req.params.id_stock, req.body.statutStock));
            }
        )

        return this.app;
    }
}

const route = new Stock(Router).getRoutes();

export class StockRoute {
    @routeDecorator(route)
    static router: any;
    constructor() {
        //
    }
}
