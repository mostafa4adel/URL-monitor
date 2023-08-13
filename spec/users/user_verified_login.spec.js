const request = require('supertest')
const app = require('../../src/server')

describe('User Routes Verified login', () => {
  it('should get a token if login with verified user', (done) => {
    const userData = {
      email: 'testuser@verified.com',
      password: 'ysasdasd',
    }

    request(app)
      .post('/api/users/login')
      .send(userData)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err)
        // Optionally, you can check the response for expected properties
        console.log(res.body)
        expect(res.body).toBeDefined()
        expect(res.body.token).toBeDefined()

        done()
      })
  })
})
