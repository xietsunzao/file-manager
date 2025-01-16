import { Router } from 'express'
import { folderController } from '../controllers/folder.controller'

const router = Router()

// Get all folders
router.get('/', folderController.getAllFolders)

// Get folder by ID
router.get('/:id', folderController.getFolderById)

// Get subfolders
router.get('/:id/subfolders', folderController.getSubfolders)

// Create new folder
router.post('/', folderController.createFolder)

// Delete folder
router.delete('/:id', folderController.deleteFolder)

// Rename folder route
router.patch('/:id', folderController.renameFolder)

export default router
