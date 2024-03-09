import { describe, it, expect } from 'vitest'
import superagent from 'superagent'
import * as dotenv from 'dotenv'

dotenv.config()
const url = process.env.API_URL!

const testUser = {
  username: 'user2@mail.com',
  key: '123456789',
  name: 'User',
}
let token = ''
let testPassData: any[] = []

describe('Testing password CRUD', () => {
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

  // it('POST /login', async () => {
  //   const res = await superagent.post(`${url}/login`).send({
  //     username: testUser.username,
  //     key: testUser.key,
  //   })

  //   expect(res.statusCode).to.be.equal(200)

  //   expect(res.body).to.be.an('object')

  //   expect(res.body).to.have.property('token')
  //   expect(res.body.token).to.be.an('string')

  //   token = res.body.token
  // })

  it('POST /password', async () => {
    const passData = [
      {
        title: 'web1',
        username: 'myUser1',
        password: '123456789abc',
        key: testUser.key,
      },
      {
        title: 'web2',
        username: 'myUser2',
        password: '123456789def',
        key: testUser.key,
      },
      {
        title: 'web3',
        username: 'myUser3',
        password: '123456789ghi',
        key: testUser.key,
      },
    ]

    const res1 = await superagent
      .post(`${url}/password`)
      .send(passData[0])
      .auth(token, { type: 'bearer' })
    const res2 = await superagent
      .post(`${url}/password`)
      .send(passData[1])
      .auth(token, { type: 'bearer' })
    const res3 = await superagent
      .post(`${url}/password`)
      .send(passData[2])
      .auth(token, { type: 'bearer' })

    expect(res1.statusCode).to.be.equal(200)
    expect(res1.body).to.be.an('object')
    expect(res1.body).to.have.property('message')
    expect(res1.body.message).to.be.an('string')
    expect(res1.body.message).to.be.equal('Password added successfully')

    expect(res2.statusCode).to.be.equal(200)
    expect(res2.body).to.be.an('object')
    expect(res2.body).to.have.property('message')
    expect(res2.body.message).to.be.an('string')
    expect(res2.body.message).to.be.equal('Password added successfully')

    expect(res3.statusCode).to.be.equal(200)
    expect(res3.body).to.be.an('object')
    expect(res3.body).to.have.property('message')
    expect(res3.body.message).to.be.an('string')
    expect(res3.body.message).to.be.equal('Password added successfully')
  })

  it('GET /password', async () => {
    const res = await superagent
      .get(`${url}/password`)
      .send({ key: testUser.key })
      .auth(token, { type: 'bearer' })

    expect(res.statusCode).to.be.equal(200)

    expect(res.body).to.be.an('array')

    expect(res.body[0]).to.be.an('object')
    expect(res.body[0]).to.have.property('id')
    expect(res.body[0].id).to.be.an('string')

    expect(res.body[0]).to.have.property('title')
    expect(res.body[0].title).to.be.an('string')
    expect(res.body[0].title).to.be.equal('web1')

    expect(res.body[0]).to.have.property('username')
    expect(res.body[0].username).to.be.an('string')
    expect(res.body[0].username).to.be.equal('myUser1')

    expect(res.body[1]).to.be.an('object')
    expect(res.body[1]).to.have.property('id')
    expect(res.body[1].id).to.be.an('string')

    expect(res.body[1]).to.have.property('title')
    expect(res.body[1].title).to.be.an('string')
    expect(res.body[1].title).to.be.equal('web2')

    expect(res.body[1]).to.have.property('username')
    expect(res.body[1].username).to.be.an('string')
    expect(res.body[1].username).to.be.equal('myUser2')

    expect(res.body[2]).to.be.an('object')
    expect(res.body[2]).to.have.property('id')
    expect(res.body[2].id).to.be.an('string')

    expect(res.body[2]).to.have.property('title')
    expect(res.body[2].title).to.be.an('string')
    expect(res.body[2].title).to.be.equal('web3')

    expect(res.body[2]).to.have.property('username')
    expect(res.body[2].username).to.be.an('string')
    expect(res.body[2].username).to.be.equal('myUser3')

    testPassData = res.body
  })

  it('GET /password/:id', async () => {
    const res1 = await superagent
      .get(`${url}/password/${testPassData[0].id}`)
      .send({ key: testUser.key })
      .auth(token, { type: 'bearer' })

    const res2 = await superagent
      .get(`${url}/password/${testPassData[1].id}`)
      .send({ key: testUser.key })
      .auth(token, { type: 'bearer' })

    const res3 = await superagent
      .get(`${url}/password/${testPassData[2].id}`)
      .send({ key: testUser.key })
      .auth(token, { type: 'bearer' })

    expect(res1.statusCode).to.be.equal(200)

    expect(res1.body).to.be.an('object')
    expect(res1.body).to.have.property('id')
    expect(res1.body.id).to.be.an('string')
    expect(res1.body.id).to.be.equal(testPassData[0].id)

    expect(res1.body).to.have.property('title')
    expect(res1.body.title).to.be.an('string')
    expect(res1.body.title).to.be.equal('web1')

    expect(res1.body).to.have.property('username')
    expect(res1.body.username).to.be.an('string')
    expect(res1.body.username).to.be.equal('myUser1')

    expect(res1.body).to.have.property('password')
    expect(res1.body.password).to.be.an('string')
    expect(res1.body.password).to.be.equal('123456789abc')

    expect(res2.statusCode).to.be.equal(200)

    expect(res2.body).to.be.an('object')
    expect(res2.body).to.have.property('id')
    expect(res2.body.id).to.be.an('string')
    expect(res2.body.id).to.be.equal(testPassData[1].id)

    expect(res2.body).to.have.property('title')
    expect(res2.body.title).to.be.an('string')
    expect(res2.body.title).to.be.equal('web2')

    expect(res2.body).to.have.property('username')
    expect(res2.body.username).to.be.an('string')
    expect(res2.body.username).to.be.equal('myUser2')

    expect(res2.body).to.have.property('password')
    expect(res2.body.password).to.be.an('string')
    expect(res2.body.password).to.be.equal('123456789def')

    expect(res3.statusCode).to.be.equal(200)

    expect(res3.body).to.be.an('object')
    expect(res3.body).to.have.property('id')
    expect(res3.body.id).to.be.an('string')
    expect(res3.body.id).to.be.equal(testPassData[2].id)

    expect(res3.body).to.have.property('title')
    expect(res3.body.title).to.be.an('string')
    expect(res3.body.title).to.be.equal('web3')

    expect(res3.body).to.have.property('username')
    expect(res3.body.username).to.be.an('string')
    expect(res3.body.username).to.be.equal('myUser3')

    expect(res3.body).to.have.property('password')
    expect(res3.body.password).to.be.an('string')
    expect(res3.body.password).to.be.equal('123456789ghi')
  })

  it('PUT /password/:id', async () => {
    const res = await superagent
      .put(`${url}/password/${testPassData[0].id}`)
      .send({
        title: 'web1Edit',
        username: 'myUser1Edit',
        password: '123456789abcEdit',
        key: testUser.key,
      })
      .auth(token, { type: 'bearer' })

    expect(res.statusCode).to.be.equal(200)

    expect(res.body).to.be.an('object')
    expect(res.body).to.have.property('message')
    expect(res.body.message).to.be.equal('Password updated successfully')

    const resDetail = await superagent
      .get(`${url}/password/${testPassData[0].id}`)
      .send({ key: testUser.key })
      .auth(token, { type: 'bearer' })

    expect(resDetail.statusCode).to.be.equal(200)

    expect(resDetail.body).to.be.an('object')
    expect(resDetail.body).to.have.property('id')
    expect(resDetail.body.id).to.be.an('string')
    expect(resDetail.body.id).to.be.equal(testPassData[0].id)

    expect(resDetail.body).to.have.property('title')
    expect(resDetail.body.title).to.be.an('string')
    expect(resDetail.body.title).to.be.equal('web1Edit')

    expect(resDetail.body).to.have.property('username')
    expect(resDetail.body.username).to.be.an('string')
    expect(resDetail.body.username).to.be.equal('myUser1Edit')

    expect(resDetail.body).to.have.property('password')
    expect(resDetail.body.password).to.be.an('string')
    expect(resDetail.body.password).to.be.equal('123456789abcEdit')
  })

  it('DELETE /password/:id', async () => {
    const res = await superagent
      .delete(`${url}/password/${testPassData[0].id}`)
      .auth(token, { type: 'bearer' })

    expect(res.statusCode).to.be.equal(200)

    expect(res.body).to.be.an('object')
    expect(res.body).to.have.property('message')
    expect(res.body.message).to.be.equal('Password deleted successfully')

    try {
      await superagent
        .delete(`${url}/password/${testPassData[0].id}`)
        .auth(token, { type: 'bearer' })
    } catch (error: any) {
      expect(error.response.statusCode).to.be.equal(404)

      expect(error.response.body).to.be.an('object')
      expect(error.response.body).to.have.property('message')
      expect(error.response.body.message).to.be.equal('Data not found')
    }
  })
})

// TODO: add negative testing for password flow
