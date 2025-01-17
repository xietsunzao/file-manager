import express from 'express'
import multer from 'multer'
import path from 'path'
import { fileController } from '../controllers/file.controller'
import fs from 'fs'

const router = express.Router()

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(process.cwd(), 'uploads')
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true })
}

// Configure multer for file upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir)
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`
        cb(null, `${uniqueSuffix}-${file.originalname}`)
    }
})

const upload = multer({ 
    storage,
    limits: {
        fileSize: 100 * 1024 * 1024 // 100MB limit
    }
}).array('files', 10)

// File routes
router.get('/folder/:folderId', (req, res, next) => {
    fileController.getFiles(req, res).catch(next)
})

router.post('/upload', (req, res, next) => {
    upload(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            return res.status(400).json({
                success: false,
                message: 'File upload error',
                errors: [{
                    field: 'files',
                    message: err.message
                }]
            })
        } else if (err) {
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                errors: [{
                    field: 'server',
                    message: err.message
                }]
            })
        }
        
        fileController.uploadFile(req, res).catch(next)
    })
})

router.patch('/:id/rename', (req, res, next) => {
    fileController.renameFile(req, res).catch(next)
})

router.delete('/:id', (req, res, next) => {
    fileController.deleteFile(req, res).catch(next)
})

export default router 