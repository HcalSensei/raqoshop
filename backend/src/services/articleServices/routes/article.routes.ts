import { Router, Request, Response } from 'express';
import { routeDecorator } from '../../../core/router';
import { cdg, ValidatorMiddleware } from '../../../utils';
import { ArticleController, ArticleMiddleware } from '../http';

class Article {
    app: any;
    constructor(app: any) {
        this.app = new app();
    }
    getRoutes() {
        this.app.get(
            '/articles',
            async (req: Request, res: Response) => {
                return cdg.api(res, ArticleController.getAll());
            }
        );

        this.app.get(
            '/catalog',
            async (req: Request, res: Response) => {
                return cdg.api(res, ArticleController.getCatalog());
            }
        );

        this.app.post(
            '/add-article',
            ArticleMiddleware.register(),
            ArticleMiddleware.verifyUniqueArticle,
            ValidatorMiddleware.validate,
            async (req: Request, res: Response) => {
                return cdg.api(res, ArticleController.create(req.body));
            }
        );

        this.app.post(
            '/update-article/:id_article',
            async (req: Request, res: Response) => {
                return cdg.api(res, ArticleController.update(req.body, req.params.id_article));
            }
        );

        this.app.get(
            '/article/:id',
            async (req: Request, res: Response) => {
                return cdg.api(res, ArticleController.getOne(req.params.id));
            }
        );

        this.app.post(
            '/activate-article/:id_article',
            async (req: Request, res: Response) => {
                return cdg.api(res, ArticleController.activateDeactivate(req.params.id_article, req.body.statutArticle));
            }
        )

        return this.app;
    }
}

const route = new Article(Router).getRoutes();

export class ArticleRoute {
    @routeDecorator(route)
    static router: any;
    constructor() {
        //
    }
}
