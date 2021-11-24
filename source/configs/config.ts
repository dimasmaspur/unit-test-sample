const SERVER = {
    hostname: process.env.SERVER_HOSTNAME || 'localhost',
    port: process.env.SERVER_PORT || 5011,
    cors: process.env.CORS || '*',
    disable: (process.env.SERVER_DISABLE || 'false').toLowerCase() == 'true'
};

const DB: any = {
    type: 'postgres',
    host: process.env.POSTGRES_HOST || 'localhost',
    port: Number(process.env.POSTGRES_PORT) || 5432,
    username: process.env.POSTGRES_USER || 'postgres',
    password: process.env.POSTGRES_PASSWORD || 'root',
    database: process.env.POSTGRES_DB || 'dev_eplantation'
};

const PASSWORD = {
    saltRounds: 10,
    totp: process.env.TOTP || 'JBSWY3DPEHPK3PXP'
};

const JWT = {
    secret_key: process.env.JWT_SECRET_KEY || 'secretjwtarvis',
    expires: 900000,
    expiresRefresh: 31557600000
};

let month: any = {
    '1': 'Januari',
    '2': 'Februari',
    '3': 'Maret',
    '4': 'April',
    '5': 'Mei',
    '6': 'Juni',
    '7': 'Juli',
    '8': 'Agustus',
    '9': 'September',
    '10': 'Oktober',
    '11': 'November',
    '12': 'Desember'
};

const config = {
    env: process.env.NODE_ENV || 'dev',
    debugMode: 'true',
    server: SERVER,
    jwt: JWT,
    database: DB,
    password: PASSWORD,
    arvisAppBaseUrl: process.env.APP_BASE_URL || 'https://eplant.arvis-engineering.net/',
    mainAppApiKey: process.env.MAIN_APP_API_KEY || '',
    month
};

export default config;
