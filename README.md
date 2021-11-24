# e-plantation-server

Backend for Arvis Approval System

## Requirements

1. [node.js v12 and npm v6+](https://www.npmjs.com/get-npm)
2. [postgresql](https://www.postgresql.org/download/)

## Usage

1. Clone this repo.
2. move to e-plantation-server folder.
3. configure .env
    ```dotenv
    NODE_ENV=dev
    SWAGGER_ENV=dev
    CORS=*
    SERVER_HOSTNAME=localhost
    SERVER_PORT=5011
    POSTGRES_HOST=localhost
    POSTGRES_PORT=5432
    POSTGRES_USER=root
    POSTGRES_PASSWORD=password
    POSTGRES_DB=eplantation
    ```
4. run `npm install` to install all package.
5. run `npm run dev` to run app in development mode.
6. open browsers and open `localhost:5011/api/eplant-server/ping`, it should return **PONG!**

## Documentation

1. For Web, open browser and go to `localhost:5011/api/eplant-server/web/docs`
2. For Mobile, open browser and go to `localhost:5011/api/approvaleplant-server/mobile/docs`
    > Note: for mobile still under development
