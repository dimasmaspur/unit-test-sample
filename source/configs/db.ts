import { ConnectionOptions } from 'typeorm';
import Config from './config';

import { SubActivity } from '../models/subActivity';
const config: ConnectionOptions = {
    type: Config.database.type,
    host: Config.database.host,
    port: Config.database.port,
    username: Config.database.username,
    password: Config.database.password,
    database: Config.database.database,
    entities: [SubActivity],
    cache: {
        duration: 5000 // 5 seconds
    },
    synchronize: true,
    logging: ['error']
};

export default config;
