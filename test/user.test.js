const supertest = require('supertest');
const router = require('../routes/user');
test(router, async () => {
    await supertest(router)
        .get('/login-status')
        .expect(401)
        .expect('Content-Type', /json/)
    
})
