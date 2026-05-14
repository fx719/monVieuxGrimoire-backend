import express from 'express'
import { signUp } from '../controllers/auth.js'

export const router = express.Router()

router.post('/signup', signUp)


