import * as dotenv from 'dotenv'
import superagent from 'superagent'
import chai from 'chai'

dotenv.config()
const expect = chai.expect
const url = process.env.API_URL!

const testUser = {
  username: 'user@mail.com',
  key: '123456789',
  name: 'User',
}
let token = ''

describe('Testing password CRUD', () => {
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

  it('POST /password', async () => {
    const res = await superagent
      .post(`${url}/password`)
      .send({
        title: 'myAccount1',
        username: 'myUser1',
        password: '123456789',
      })
      .auth(token, { type: 'bearer' })

    expect(res.statusCode).to.equal(200)

    expect(res.body).to.be.an('object')

    expect(res.body).to.have.property('message')
    expect(res.body.message).to.be.an('string')
    expect(res.body.message).to.be.equal('Password added successfully')

    token = res.body.token
  })
})
