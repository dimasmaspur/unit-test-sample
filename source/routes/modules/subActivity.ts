import express from 'express';
import SubActivityController from '../../controllers/modules/subActivity';
import createResponse from '../../utils/http-response';
import config, { RouteConfig } from '../../configs/route';
import AccessModule from '../../middlewares/module';

export class SubActivity extends RouteConfig {
    constructor(app: express.Application) {
        super(app, 'SubActivity');
    }

    configureRoutes() {
        const use =
            (fn: any): any =>
            (req: any, res: any, next: any) => {
                Promise.resolve(fn(req, res, next)).catch((err) => {
                    createResponse(res, 500, { error: err });
                });
            };

        const modules: string = 'subActivity';
        this.app.route(`${config.urlWeb}${modules}/create`).post(SubActivityController.validate, use(SubActivityController.create));
        this.app.route(`${config.urlWeb}${modules}/`).get(use(SubActivityController.search));

        return this.app;
    }
}
