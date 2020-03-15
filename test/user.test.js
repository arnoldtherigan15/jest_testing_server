const request = require('supertest')
const app = require('../app')
const { sequelize } = require('../models')
const { queryInterface } = sequelize

let data = {
    email : 'arnold@mail.com',
    password : 'secret'
}
describe('User routes',()=>{
    afterEach((done) => {
        queryInterface.bulkDelete('Users', {})
          .then(_ => {
            done()
          }).catch(err => done(err))
    })
    describe('POST /register',()=> {
        describe('success process',()=> {
            test('should send an object (email,id) with status code 201',(done)=>{
                request(app)
                    .post('/register')
                    .send(data)
                    .end((err,res)=>{
                        expect(err).toBe(null)
                        expect(res.body).toHaveProperty('email', data.email)
                        expect(res.body).toHaveProperty('id', expect.any(Number))
                        expect(res.status).toBe(201)
                        done()
                    })
            })
        })
        describe('error process',()=>{
            test('should send an error wtih status 400 because of missing email value',(done)=>{
                const withoutEmail = { ...data }
                delete withoutEmail.email
                request(app)
                    .post('/register')
                    .send(withoutEmail)
                    .end((err,res)=>{
                        expect(err).toBe(null)
                        expect(res.body).toHaveProperty('message', 'Bad Request')
                        expect(res.body).toHaveProperty('errors', expect.any(Array))
                        expect(res.body.errors).toContain('email is required')
                        expect(res.body.errors.length).toBeGreaterThan(0)
                        expect(res.status).toBe(400)  
                        done()
                    })
            })
            test('should send an error with status 400 because password min 6 validation',(done)=>{
                const falsePassFormat = { ...data, password: 'hai' }
                request(app)
                    .post('/register')
                    .send(falsePassFormat)
                    .end((err,res)=>{
                        expect(err).toBe(null)
                        expect(res.body).toHaveProperty('message', 'Bad Request')
                        expect(res.body).toHaveProperty('errors', expect.any(Array))
                        expect(res.body.errors).toContain('password minimal 6 char')
                        expect(res.body.errors.length).toBeGreaterThan(0)
                        expect(res.status).toBe(400)  
                        done()
                    })
            })
        })
    })
})
