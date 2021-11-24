import express from 'express';
export abstract class RouteConfig {
    app: express.Application;
    name: string;

    constructor(app: express.Application, name: string) {
        this.app = app;
        this.name = name;
        this.configureRoutes();
    }
    getName() {
        return this.name;
    }
    abstract configureRoutes(): express.Application;
}

const config = {
    urlWeb: '/api/sample-server/web/v0/',
    urlMobile: '/api/sample-server/mobile/v0/'
};

export default config;
