import { describe, it, expect } from 'vitest'
import superagent, { type Request, type Response } from 'superagent'

const url = process.env.API_URL!
const testUser = {
  username: 'user@mail.com',
  key: '123456789',
  name: 'User',
}

let token = ''
let currentKey = testUser.key

async function getErrorResponse(request: Request) {
  const response = await request.ok(() => true)

  if (response.statusCode < 400) {
    throw new Error('Expected request to fail')
  }

  return response as Response
}

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
      key: currentKey,
    })

    expect(res.statusCode).to.equal(200)

    expect(res.body).to.be.an('object')

    expect(res.body).to.have.property('token')
    expect(res.body.token).to.be.an('string')

    token = res.body.token
  })

  it('POST /change-key', async () => {
    const newKey = '123456789101112'

    const res = await superagent
      .post(`${url}/change-key`)
      .send({
        rawOldKey: currentKey,
        rawNewKey: newKey,
      })
      .auth(token, { type: 'bearer' })

    expect(res.statusCode).to.equal(200)

    expect(res.body).to.be.an('object')

    expect(res.body).to.have.property('message')
    expect(res.body.message).to.be.an('string')
    expect(res.body.message).to.be.equal('Key updated, please logout and login again with new key')

    const loginRes = await superagent.post(`${url}/login`).send({
      username: testUser.username,
      key: newKey,
    })

    expect(loginRes.statusCode).to.equal(200)

    expect(loginRes.body).to.be.an('object')

    expect(loginRes.body).to.have.property('token')
    expect(loginRes.body.token).to.be.an('string')

    currentKey = newKey
    token = loginRes.body.token
  })
})

describe('Testing negative user flow', () => {
  it('POST /register should reject duplicate username', async () => {
    const res = await getErrorResponse(superagent.post(`${url}/register`).send(testUser))

    expect(res.statusCode).to.equal(400)

    expect(res.body).to.be.an('object')
    expect(res.body).to.have.property('message')
    expect(res.body.message).to.equal(
      'Email/username has been used by another user, a new user cannot be created with this email/username'
    )
  })

  it('POST /register should reject invalid payload', async () => {
    const res = await getErrorResponse(
      superagent.post(`${url}/register`).send({
        username: 'invalid-register@mail.com',
        name: 'Invalid Register',
        key: 'short',
      })
    )

    expect(res.statusCode).to.equal(400)

    expect(res.body).to.be.an('object')
    expect(res.body).to.have.property('message')
    expect(res.body.message).to.equal(
      'Validation error, please send the data in the correct data type'
    )
  })

  it('POST /login should reject unknown username', async () => {
    const res = await getErrorResponse(
      superagent.post(`${url}/login`).send({
        username: 'missing-user@mail.com',
        key: currentKey,
      })
    )

    expect(res.statusCode).to.equal(404)

    expect(res.body).to.be.an('object')
    expect(res.body).to.have.property('message')
    expect(res.body.message).to.equal('Username not registered')
  })

  it('POST /login should reject wrong key', async () => {
    const res = await getErrorResponse(
      superagent.post(`${url}/login`).send({
        username: testUser.username,
        key: 'wrong-key-value',
      })
    )

    expect(res.statusCode).to.equal(400)

    expect(res.body).to.be.an('object')
    expect(res.body).to.have.property('message')
    expect(res.body.message).to.equal('Credential error')
  })

  it('POST /login should reject invalid payload', async () => {
    const res = await getErrorResponse(
      superagent.post(`${url}/login`).send({
        username: testUser.username,
        key: 'short',
      })
    )

    expect(res.statusCode).to.equal(400)

    expect(res.body).to.be.an('object')
    expect(res.body).to.have.property('message')
    expect(res.body.message).to.equal(
      'Validation error, please send the data in the correct data type'
    )
  })

  it('POST /change-key should reject missing auth', async () => {
    const res = await getErrorResponse(
      superagent.post(`${url}/change-key`).send({
        rawOldKey: currentKey,
        rawNewKey: '12345678987654321',
      })
    )

    expect(res.statusCode).to.equal(400)

    expect(res.body).to.be.an('object')
    expect(res.body).to.have.property('message')
    expect(res.body.message).to.equal('Invalid auth')
  })

  it('POST /change-key should reject wrong old key', async () => {
    const res = await getErrorResponse(
      superagent
        .post(`${url}/change-key`)
        .send({
          rawOldKey: 'wrong-old-key',
          rawNewKey: '12345678987654321',
        })
        .auth(token, { type: 'bearer' })
    )

    expect(res.statusCode).to.equal(400)

    expect(res.body).to.be.an('object')
    expect(res.body).to.have.property('message')
    expect(res.body.message).to.equal('Credential invalid')
  })

  it('POST /change-key should reject invalid payload', async () => {
    const res = await getErrorResponse(
      superagent
        .post(`${url}/change-key`)
        .send({
          rawOldKey: currentKey,
          rawNewKey: 'short',
        })
        .auth(token, { type: 'bearer' })
    )

    expect(res.statusCode).to.equal(400)

    expect(res.body).to.be.an('object')
    expect(res.body).to.have.property('message')
    expect(res.body.message).to.equal(
      'Validation error, please send the data in the correct data type'
    )
  })
})
