import { Router, Request, Response } from 'express'
import { routeDecorator } from '../../../core/router'
import { cdg, JwtMiddleware, MulterMiddleware, ValidatorMiddleware } from '../../../utils'
import { utilisateurController, utilisateurImageCnt } from '../http'
import { UserMiddleware } from '../http/user.middleware'

class User {
    app: any;
    constructor(app: any) {
        this.app = new app();
    }
    getRoutes() {
        this.app.use((req: Request, res: Response, next: Function) => {
            // Set Cross-Origin-Resource-Policy header
            res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
            res.setHeader('Cross-Origin-Opener-Policy', 'cross-origin');
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
            next();
        });

        this.app.get(
            '/users',
            //JwtMiddleware.checkToken,
            async (req: Request, res: Response) => {
                return cdg.api(res, utilisateurController.getAll());
            }
        )

        this.app.post(
            '/register-user',
            UserMiddleware.register(),
            UserMiddleware.verifyUniqueLogin,
            ValidatorMiddleware.validate,
            async (req: Request, res: Response) => {

                return cdg.api(res, utilisateurController.create(req.body));
            }
        )

        this.app.post(
            '/resgiter-client',
            UserMiddleware.register(),
            ValidatorMiddleware.validate,
            async (req: Request, res: Response) => {
                return cdg.api(res, utilisateurController.createClient(req.body));
            }
        )

        this.app.post(
            '/register-driver',
            UserMiddleware.register(),
            ValidatorMiddleware.validate,
            async (req: Request, res: Response) => {
                return cdg.api(res, utilisateurController.createDriver(req.body));
            }
        )

        this.app.get(
            '/drivers',
            async (req: Request, res: Response) => {
                return cdg.api(res, utilisateurController.getAllDriver());
            }
        )

        this.app.post(
            '/login-user',
            async (req: Request, res: Response) => {
                const login = req.body.login;
                const mot_de_passe = req.body.mot_de_passe;
                return cdg.api(res, utilisateurController.login(login, mot_de_passe));
            }
        )

        this.app.post(
            '/update-user',
            //JwtMiddleware.checkToken,     
            async (req: Request, res: Response) => {
                return cdg.api(res, utilisateurController.update(req.body));
            }
        )

        this.app.get(
            '/get-user-by-id/:id',
            //JwtMiddleware.checkToken,
            async (req: Request, res: Response) => {
                return cdg.api(res, utilisateurController.getOne(req.params.id));
            }
        )

        this.app.get(
            '/get-client',
            //JwtMiddleware.checkToken,
            async (req: Request, res: Response) => {
                return cdg.api(res, utilisateurController.getClient());
            }
        )

        return this.app;
    }
}

const route = new User(Router).getRoutes();

export class UserRoute {
    @routeDecorator(route)
    static router: any;
    constructor() {
        //
    }
}