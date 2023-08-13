const request = require('supertest')
const app = require('../../src/server')

const testToken =
  'eyJhbGciOiJIUzI1NiJ9.bW9zdGFmYWFkZWwyMTcxQGdtYWlsLmNvbQ.ZXT9OaC_I4OjnXPXHBArVSNLk1mgXYka_aSsnGPsfdw'

describe('create urls and add tags retrive reports based on tags', () => {
  it('1.create url 2.add tag 3.get reports based on tags', (done) => {
    const url_data = {
      url: 'www.xgbcvcxd.com',
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
          .post('/api/urls/add_tag')
          .set('Authorization', `Bearer ${testToken}`)
          .send({ id: url_id, tag: 'tag1' })
          .expect(200)
          .end((err, res) => {
            if (err) return done(err)
            // Optionally, you can check the response for expected properties

            expect(res.body).toBeDefined()
            console.log('TAG ADDED')
            request(app)
              .get('/api/reports/get_reports?tags=tag1')
              .set('Authorization', `Bearer ${testToken}`)
              .expect(200)
              .end((err, res) => {
                if (err) return done(err)
                // Optionally, you can check the response for expected properties
                expect(res.body).toBeDefined()
                console.log('REPORTS RETRIEVED')
                done()
              })
          })
      })
  })
})
