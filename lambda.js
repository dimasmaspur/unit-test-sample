const awsServerlessExpress = require('aws-serverless-express');
const app = require('./build/app');
const eventSource = require('./build/event');
const server = awsServerlessExpress.createServer(app);

exports.handler = async (event, context) => {
    if (event.service) {
        await eventSource.default(event);

        return "Event completed!";
    }

    return awsServerlessExpress.proxy(server, event, context, 'PROMISE').promise;
};
