import express from 'express'
import { createBook, getBooks } from '../controllers/books.js'
import { checkToken } from '../middleware/auth.js'
import { uploadMiddleware } from '../middleware/multer-config.js'

export const router = express.Router()

router.get('/', getBooks)
router.post('/', checkToken, uploadMiddleware, createBook)