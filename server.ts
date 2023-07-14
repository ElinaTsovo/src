import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import bcrypt from 'bcrypt'
import jsonwebtoken from 'jsonwebtoken'
import {connectioDB} from './connection'
import router from './router'

const app = express()

app.use(express.json())
app.use('/', router)
connectioDB()

const port = process.env.PORT || 7000

app.listen(port, () =>{
    console.log(`The server is runing on http://localhost:${port}`)
})

