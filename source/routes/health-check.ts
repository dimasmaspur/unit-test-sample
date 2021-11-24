import express from 'express';
import HealthCheckController from '../controllers/health-check';
import createResponse from '../utils/http-response';
import { RouteConfig } from '../configs/route';

export class HealthCheck extends RouteConfig {
    constructor(app: express.Application) {
        super(app, 'HealthCheck');
    }

    configureRoutes() {
        const use =
            (fn: any): any =>
            (req: any, res: any, next: any) => {
                Promise.resolve(fn(req, res, next)).catch((err) => {
                    createResponse(res, 500, { error: err });
                });
            };

        this.app.route('/api/eplant-server/ping').get(use(HealthCheckController.healthCheck));
        this.app.route('/api/eplant-server/excel2sheet').get(use(HealthCheckController.excel2Sheet));

        return this.app;
    }
}
