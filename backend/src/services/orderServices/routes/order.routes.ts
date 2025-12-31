import { Router, Request, Response } from 'express';
import { routeDecorator } from '../../../core/router';
import { cdg, ValidatorMiddleware } from '../../../utils';
import { OrderController, OrderMiddleware } from '../http';

class Order {
    app: any;
    constructor(app: any) {
        this.app = new app();
    }
    getRoutes() {
        this.app.get(
            '/orders',
            async (req: Request, res: Response) => {
                return cdg.api(res, OrderController.getAll());
            }
        );

        this.app.post(
            '/add-order',
            OrderMiddleware.register(),
            OrderMiddleware.verifyUniqueOrder,
            ValidatorMiddleware.validate,
            async (req: Request, res: Response) => {
                return cdg.api(res, OrderController.create(req.body));
            }
        );

        this.app.post(
            '/update-order/:id_commande',
            async (req: Request, res: Response) => {
                return cdg.api(res, OrderController.update(req.body, req.params.id_commande));
            }
        );

        this.app.get(
            '/order/:id',
            async (req: Request, res: Response) => {
                return cdg.api(res, OrderController.getOne(req.params.id));
            }
        );

        return this.app;
    }
}

const route = new Order(Router).getRoutes();

export class OrderRoute {
    @routeDecorator(route)
    static router: any;
    constructor() {
        //
    }
}
