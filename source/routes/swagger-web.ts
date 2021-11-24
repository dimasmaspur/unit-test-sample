import express from 'express';
import path from 'path';
import swaggerUi from 'swagger-ui-express';
import config from '../configs/config';
import { RouteConfig } from '../configs/route';
import { SwaggerModel } from '../interfaces/swagger';

const swaggerDev = require(path.resolve('./documentation/web/swagger.json'));
const swaggerRemotedev = require(path.resolve('./documentation/web/swaggerRemotedev.json'));
const swaggerStaging = require(path.resolve('./documentation/web/swaggerStaging.json'));
const subactivityPath = require(path.resolve('./documentation/web/path/subactivity.json'));

export class SwaggerWebRoutes extends RouteConfig {
    swagger = {} as SwaggerModel;

    constructor(app: express.Application) {
        super(app, 'SwaggerWebRoutes');
        this.configureDocs();
    }

    configureDocs() {
        switch (config.env) {
            case 'dev':
                this.swagger = swaggerDev;
                break;
            case 'remotedev':
                this.swagger = swaggerRemotedev;
                break;
            case 'stg':
                this.swagger = swaggerStaging;
                break;
            default:
                this.swagger = swaggerStaging;
        }
    }

    configureRoutes() {
        this.app.use(
            '/api/sample-server/web/docs',
            (req: any, res: express.Response, next: express.NextFunction) => {
                const paths = {
                    ...subactivityPath
                };

                this.swagger.paths = paths;
                req.swaggerDoc = this.swagger;
                next();
            },
            swaggerUi.serve,
            swaggerUi.setup()
        );

        return this.app;
    }
}
