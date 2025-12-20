import { Router, Request, Response} from 'express'
import { routeDecorator } from '../../../core/router'
import { cdg,JwtMiddleware } from '../../../utils'
import { RoleController } from '../http'
import { ValidatorMiddleware } from '../../../utils'

class Role{
    app:any;
    constructor(app: any){
        this.app = new app();
    }

    getRoutes(){
        this.app.use((req: Request, res: Response, next: Function) => {
            // Set Cross-Origin-Resource-Policy header
            res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
            res.setHeader('Cross-Origin-Opener-Policy', 'cross-origin');
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
            next();
        });

        this.app.get(
            '/roles',
            //JwtMiddleware.checkToken,
            async (req: Request, res: Response) => {
                return cdg.api(res, RoleController.getAll());
            }
        )

        this.app.get(
            '/roles-active',
            //JwtMiddleware.checkToken,
            async (req: Request, res: Response) => {
                return cdg.api(res, RoleController.getAllActive());
            }
        )
        return this.app;
    }
}

const route = new Role(Router).getRoutes();

export class RoleRoute{
    @routeDecorator(route)
    static router: any;
    constructor(){
        //
    }
}
