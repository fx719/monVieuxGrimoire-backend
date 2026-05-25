import multer from 'multer'

const storage = multer.memoryStorage({
    destination: (req, file, callback) => {
        callback(null, 'images')
    }
})

export const uploadMiddleware = multer({ storage: storage }).single('image')







