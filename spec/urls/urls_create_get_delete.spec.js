const request = require('supertest')
const app = require('../../src/server')

const testToken =
  'eyJhbGciOiJIUzI1NiJ9.bW9zdGFmYWFkZWwyMTcxQGdtYWlsLmNvbQ.ZXT9OaC_I4OjnXPXHBArVSNLk1mgXYka_aSsnGPsfdw'

describe('URL Routes Verified login', () => {
  it('1.create url 2.get url 3.delete url', (done) => {
    const url_data = {
      url: 'www.xgvcxd.com',
      name: 'fxbfk',
      description: 'Google Search Engine',
      category: 'Search Engine',
      protocol: 'https',
      ignoreSSL: true,
    }

    request(app)
      .post('/api/urls/create_url')
      .set('Authorization', `Bearer ${testToken}`)
      .send(url_data)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err)
        // Optionally, you can check the response for expected properties
        const url_id = res.body.id
        expect(res.body).toBeDefined()
        expect(res.body.id).toBeDefined()
        console.log('URL CREATED')
        request(app)
          .post('/api/urls/get_url')
          .set('Authorization', `Bearer ${testToken}`)
          .send({ id: url_id })
          .expect(200)
          .end((err, res) => {
            if (err) return done(err)
            // Optionally, you can check the response for expected properties

            expect(res.body).toBeDefined()
            console.log('URL GET')
            request(app)
              .post('/api/urls/delete_url')
              .set('Authorization', `Bearer ${testToken}`)
              .send({ id: url_id })
              .expect(200)
              .end((err, res) => {
                if (err) return done(err)
                // Optionally, you can check the response for expected properties
                expect(res.body).toBeDefined()
                console.log('URL DELETED')
                done()
              })
          })
      })
  })
})
