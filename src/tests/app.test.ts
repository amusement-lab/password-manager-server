import { describe, it, expect } from 'vitest'
import superagent from 'superagent'
import * as dotenv from 'dotenv'

dotenv.config()
const url = process.env.API_URL!

describe('Testing connection to API server', () => {
  it('GET /', async () => {
    const res = await superagent.get(url)

    expect(res.statusCode).to.equal(200)

    expect(res.body).to.be.an('object')
    expect(res.body).to.have.property('message')

    expect(res.body.message).to.be.an('string')
    expect(res.body.message).to.equal('Server connected')
  })
})
