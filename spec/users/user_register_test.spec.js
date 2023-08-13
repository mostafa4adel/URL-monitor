const request = require('supertest')
const app = require('../../src/server')

describe('User Routes', () => {
  it('should register a new user', (done) => {
    const userData = {
      email: 'testuser@example.com',
      password: 'testpassword',
    }

    request(app)
      .post('/api/users/register')
      .send(userData)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err)
        // Optionally, you can check the response for expected properties

        expect(res.body).toBeDefined()
        expect(res.body.user.email).toBeDefined()
        done()
      })
  })

  it('should show unverified user', (done) => {
    const loginData = {
      email: 'testuser@example.com',
      password: 'testpassword',
    }

    request(app)
      .post('/api/users/login')
      .send(loginData)
      .expect(403)
      .end((err, res) => {
        if (err) return done(err)
        // Optionally, you can check the response for expected properties
        done()
      })
  })
})
