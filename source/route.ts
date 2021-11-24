import { RouteConfig } from './configs/route';
import express from 'express';
import { HealthCheck } from './routes/health-check';
import { SubActivity } from './routes/modules/subActivity';
// import { RkhHarvest } from './routes/modules/rkhHarvest';

import { SwaggerWebRoutes } from './routes/swagger-web';

class Route {
    private routes: Array<RouteConfig>;

    constructor(app: express.Application) {
        this.routes = new Array<RouteConfig>(
            new SwaggerWebRoutes(app),
            new HealthCheck(app),
            new SubActivity(app)
            // new RkhHarvest(app)
        );
    }

    public get Routes(): Array<RouteConfig> {
        return this.routes;
    }
}

export default Route;
