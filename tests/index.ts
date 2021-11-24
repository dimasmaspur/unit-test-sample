import chai from 'chai';
import chaiHttp from 'chai-http';
import { response } from 'express';
import 'mocha';

import server = require('../source/app');

chai.should();
chai.use(chaiHttp);

describe('Subactivity API Test', () => {
    describe('GET /api/sample-server/web/v0/subactivity', () => {
        it('It should get all subactivity', (done) => {
            chai.request(server)
                .get('/api/sample-server/web/v0/subactivity')
                .end((err, response) => {
                    response.should.have.status(200);
                    done();
                });
        });
    });
});
