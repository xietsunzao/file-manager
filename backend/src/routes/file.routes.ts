import express from 'express'
import { fileController } from '../controllers/file.controller'

const router = express.Router()

router.get('/', fileController.getFiles)
router.get('/folder/:folder_id', fileController.getFiles)
router.get('/:id', fileController.getFileById)
router.post('/', fileController.createFile)
router.patch('/:id', fileController.updateFile)
router.delete('/:id', fileController.deleteFile)
router.patch('/:id/rename', fileController.renameFile)

export default router 