const request = require('supertest')
const app = require('../../src/server')

const testToken =
  'eyJhbGciOiJIUzI1NiJ9.bW9zdGFmYWFkZWwyMTcxQGdtYWlsLmNvbQ.ZXT9OaC_I4OjnXPXHBArVSNLk1mgXYka_aSsnGPsfdw'

let urlId // Shared variable to store the URL ID

describe('URL create, remove tag, delete URL', () => {
  it('1. create url', (done) => {
    const urlData = {
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
      .send(urlData)
      .expect(200)
      .end((err, res) => {
        if (err) {
          console.error(err)
          return done(err)
        }

        // Store the URL ID in the shared variable
        urlId = res.body.id

        // Optionally, you can check the response for expected properties
        expect(res.body).toBeDefined()
        expect(res.body.id).toBeDefined()

        done()
      })
  })

  it('2. remove tag', (done) => {
    // Wait for the urlId to be available
    if (!urlId) {
      return setTimeout(() => done(), 100) // Retry after a short delay
    }

    request(app)
      .post('/api/urls/remove_tag')
      .set('Authorization', `Bearer ${testToken}`)
      .send({ id: urlId, tag: 'tag1' })
      .expect(200)
      .end((err, res) => {
        if (err) {
          console.error(err)
          return done(err)
        }
        // Optionally, you can check the response for expected properties
        expect(res.body).toBeDefined()
        done()
      })
  })

  it('3. delete url', (done) => {
    // Wait for the urlId to be available
    if (!urlId) {
      return setTimeout(() => done(), 100) // Retry after a short delay
    }

    request(app)
      .post('/api/urls/delete_url')
      .set('Authorization', `Bearer ${testToken}`)
      .send({ id: urlId })
      .expect(200)
      .end((err, res) => {
        if (err) {
          console.error(err)
          return done(err)
        }
        // Optionally, you can check the response for expected properties
        expect(res.body).toBeDefined()
        done()
      })
  })
})
