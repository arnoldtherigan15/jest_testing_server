const env = process.env.NODE_ENV || 'development'

switch (env) {
  case 'development':
    require('dotenv').config({path: process.cwd() + '/.env'})
      break
  case 'test':
    require('dotenv').config({path: process.cwd() + '/.env.test'})
}

const express = require('express')
const { User } = require('./models')

const app = express()

const PORT = process.env.PORT

app.use(express.urlencoded({ extended: false }))
app.use(express.json())


app.post('/register',(req,res,next)=>{
    let { email,password } = req.body
    User.create({
        email,
        password
    })
        .then(data=>{
            res.status(201).json({
                email: data.email,
                id: data.id
            })
        })
        .catch(err=>{
            next(err)
        })
})

app.use((err,req,res,next)=>{
    let status = 500
    let message = { message: 'internal server error' }
    switch (err.name) {
        case 'SequelizeValidationError':
            const errors = []
            err.errors.forEach(error => {
              errors.push(error.message)
            })
            message = {
              message: 'Bad Request',
              errors
            }
            status = 400
            res.status(status).json(message)
        break;
    
        default:
            res.status(status).json(message)
        break;
    }
})

module.exports = app

