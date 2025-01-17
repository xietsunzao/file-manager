import { Request, Response } from 'express'
import { FileService } from '../services/file.service'

export class FileController {
    private service = new FileService()

    constructor() {
        // Bind methods to instance
        this.getFiles = this.getFiles.bind(this)
        this.getFileById = this.getFileById.bind(this)
        this.createFile = this.createFile.bind(this)
        this.updateFile = this.updateFile.bind(this)
        this.deleteFile = this.deleteFile.bind(this)
        this.renameFile = this.renameFile.bind(this)
        this.uploadFile = this.uploadFile.bind(this)
    }

    getFiles = async (req: Request, res: Response) => {
        try {
            const folderId = req.params.folderId ? parseInt(req.params.folderId) : undefined
            const files = await this.service.getFiles(folderId)
            
            res.json({
                success: true,
                message: folderId 
                    ? 'Files retrieved successfully for folder' 
                    : 'All files retrieved successfully',
                data: files
            })
        } catch (error) {
            throw error
        }
    }

    getFileById = async (req: Request, res: Response) => {
        try {
            const id = parseInt(req.params.id)
            const file = await this.service.getFileById(id)
            res.json({
                success: true,
                message: 'File retrieved successfully',
                data: file
            })
        } catch (error) {
            throw error
        }
    }

    createFile = async (req: Request, res: Response) => {
        try {
            const file = await this.service.createFile(req.body)
            res.status(201).json({
                success: true,
                message: 'File created successfully',
                data: file
            })
        } catch (error) {
            throw error
        }
    }

    updateFile = async (req: Request, res: Response) => {
        try {
            const id = parseInt(req.params.id)
            const file = await this.service.updateFile(id, req.body)
            res.json({
                success: true,
                message: 'File updated successfully',
                data: file
            })
        } catch (error) {
            throw error
        }
    }

    deleteFile = async (req: Request, res: Response) => {
        try {
            const id = parseInt(req.params.id)
            await this.service.deleteFile(id)

            res.json({
                success: true,
                message: 'File deleted successfully'
            })
        } catch (error) {
            throw error
        }
    }

    renameFile = async (req: Request, res: Response) => {
        try {
            const id = parseInt(req.params.id)
            const { name } = req.body

            const file = await this.service.renameFile(id, name)

            res.json({
                success: true,
                message: 'File renamed successfully',
                data: file
            })
        } catch (error) {
            throw error
        }
    }

    uploadFile = async (req: Request, res: Response) => {
        try {
            const files = req.files as Express.Multer.File[]
            const { folder_id } = req.body

            if (!files || files.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: 'No files uploaded',
                    errors: [{
                        field: 'files',
                        message: 'At least one file is required'
                    }]
                })
            }

            if (!folder_id) {
                return res.status(400).json({
                    success: false,
                    message: 'Folder ID is required',
                    errors: [{
                        field: 'folder_id',
                        message: 'Folder ID is required'
                    }]
                })
            }

            const savedFiles = await Promise.all(files.map(file => 
                this.service.createFile({
                    name: file.originalname,
                    type: file.mimetype,
                    size: file.size,
                    folder: {
                        connect: {
                            id: parseInt(folder_id)
                        }
                    },
                    path: file.path
                })
            ))

            res.status(201).json({
                success: true,
                message: 'Files uploaded successfully',
                data: savedFiles
            })
        } catch (error) {
            console.error('Upload error:', error)
            throw error
        }
    }
} 

// Create a singleton instance
export const fileController = new FileController() 
