import express from 'express'
import { checkToken } from '../middleware/auth.js'
import { uploadMiddleware } from '../middleware/multer-config.js'
import { createBook, getBestRatedBooks, getBook, getBooks } from '../controllers/books.js'


export const router = express.Router()

router.get('/', getBooks)
router.get('/bestrating', getBestRatedBooks)
router.get('/:id', getBook)
router.post('/', checkToken, uploadMiddleware, createBook)