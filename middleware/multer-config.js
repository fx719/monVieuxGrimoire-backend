import multer from 'multer'

const storage = multer.memoryStorage({
    destination: (req, file, callback) => {
        callback(null, 'images')
    }
})

export const uploadMiddleware = multer({
    storage: storage, fileFilter: (req, file, callback) => {

        if (file.mimetype !== "image/jpg" && file.mimetype !== "image/jpeg" && file.mimetype !== "image/png") {
            return callback(new Error('Erreur dans le format du fichier'))
        } else {
            callback(null, true)
        }
    }
}).single('image')







