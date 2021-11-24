import dotenv from 'dotenv';
dotenv.config({ path: process.argv[2] });
import http from 'http';
import helmet from 'helmet';
import express from 'express';
import cors from 'cors';
import config from './configs/config';
import Logger from './services/logger';
import createResponse from './utils/http-response';
import dbConfig from './configs/db';
import { createConnection } from 'typeorm';

import Route from './route';
const upload = require('express-fileupload');
import useragent from 'express-useragent';

const app: express.Application = express();
const server: http.Server = http.createServer(app);

/** Secure Express HTTP headers */
app.use(helmet());
app.use(useragent.express());
app.use(upload());

/** Parse the body of the request */
app.use(cors({ origin: config.server.cors }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

/** Rules of our API */
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

    if (req.method == 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }

    next();
});

new Route(app);

/** Error handling */
app.use((req, res, next) => {
    createResponse(res, 404, {
        message: { id: 'Not found' }
    });
    return;
});

if (config.server.disable == true) {
    Logger.debug(`Server is running on lambda`);
} else {
    createConnection(dbConfig)
        .then(async (_connection) => {
            app.listen(config.server.port, () => {
                console.log('Server is running on port', config.server.port);
            });
        })
        .catch((err) => {
            console.log('Unable to connect to db', err);
            process.exit(1);
        });
}

module.exports = app;
