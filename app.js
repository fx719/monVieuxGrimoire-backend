import express from 'express'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { loadEnvFile } from 'node:process'
import mongoose from 'mongoose'
import { router as authRouter } from './routes/auth.js'
import { router as booksRouter } from './routes/books.js'
import helmet from "helmet"
import { rateLimit } from 'express-rate-limit'


export const app = express()
const rootDir = dirname(fileURLToPath(import.meta.url))
const limiter = rateLimit({
    //200 requests per Ip, during 15 minutes
    windowMs: 15 * 60 * 1000,
    limit: 200
})
loadEnvFile('./config/.env')

app.use(helmet({ crossOriginResourcePolicy: false }))
app.use(limiter)
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


app.use('/images', express.static(join(rootDir, 'images')))


app.get('/', (req, res) => {
    res.status(200).json({ message: "hello, world !" })
})

app.use((err, req, res, next) => {
    console.error(err)
})