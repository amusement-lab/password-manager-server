import { describe, it, expect } from 'vitest'
import superagent from 'superagent'
import * as dotenv from 'dotenv'

dotenv.config()
const url = process.env.API_URL!

const testUser = {
  username: 'user@mail.com',
  key: '123456',
  name: 'User',
}
let token = ''

describe('Testing user flow', () => {
  it('POST /register', async () => {
    const res = await superagent.post(`${url}/register`).send(testUser)

    expect(res.statusCode).to.equal(201)

    expect(res.body).to.be.an('object')

    expect(res.body).to.have.property('message')
    expect(res.body.message).to.be.an('string')
    expect(res.body.message).to.be.equal('Register success')

    expect(res.body).not.to.have.property('key')
  })

  it('POST /login', async () => {
    const res = await superagent.post(`${url}/login`).send({
      username: testUser.username,
      key: testUser.key,
    })

    expect(res.statusCode).to.equal(200)

    expect(res.body).to.be.an('object')

    expect(res.body).to.have.property('token')
    expect(res.body.token).to.be.an('string')

    token = res.body.token
  })

  it('POST /change-password', async () => {
    const res = await superagent
      .post(`${url}/change-password`)
      .send({
        oldKey: testUser.key,
        newKey: '123456789',
      })
      .auth(token, { type: 'bearer' })

    expect(res.statusCode).to.equal(200)

    expect(res.body).to.be.an('object')

    expect(res.body).to.have.property('message')
    expect(res.body.message).to.be.an('string')
    expect(res.body.message).to.be.equal('Key updated, please logout and login again with new key')

    const loginRes = await superagent.post(`${url}/login`).send({
      username: testUser.username,
      key: '123456789',
    })

    expect(loginRes.statusCode).to.equal(200)

    expect(loginRes.body).to.be.an('object')

    expect(loginRes.body).to.have.property('token')
    expect(loginRes.body.token).to.be.an('string')

    token = loginRes.body.token
  })
})

// TODO: add negative testing for user flow
