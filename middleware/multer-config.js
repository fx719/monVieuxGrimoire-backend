import multer from 'multer'

const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png ': 'png'
}


const storage = multer.diskStorage({
    destination: (req, file, callback) => {

        callback(null, 'images')

    },
    filename: (req, file, callback) => {
        const name = file.originalname.split(' ').join('_')
        const extension = MIME_TYPES[file.mimetype]


        callback(null, name + Date.now() + '.' + extension)

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







