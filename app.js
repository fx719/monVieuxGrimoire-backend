import express from 'express'
import { loadEnvFile } from 'node:process'
import mongoose from 'mongoose'
import { router as authRouter } from './routes/auth.js'
import { router as booksRouter } from './routes/books.js'


export const app = express()
loadEnvFile('./config/.env')

app.use(express.json())

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('connexion MongoDd reussie'))
    .catch(() => console.log('connexion MongoDd echouee'))

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS')
    next()
})

app.use('/api/books', booksRouter)
app.use('/api/auth', authRouter)


app.get('/', (req, res) => {
    res.status(200).json({ message: "hello, world !" })
})

app.use((err, req, res, next) => {
    console.error(err)
})