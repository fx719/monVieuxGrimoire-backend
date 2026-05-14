import express from 'express'
import { getBooks } from '../controllers/books.js'

export const router = express.Router()

router.get('/', getBooks)