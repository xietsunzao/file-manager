import { Request, Response } from 'express'
import { folderService } from '../services/folder.service'
import { Validator } from '../core/validator'
import { FolderValidation } from '../validations/folder.validation'
import { CreateFolderDto } from '@/dtos/folder.dto'

export class FolderController {
  private service = folderService

  constructor() {
    // Bind methods to instance
    this.getAllFolders = this.getAllFolders.bind(this)
    this.getFolderById = this.getFolderById.bind(this)
    this.getSubfolders = this.getSubfolders.bind(this)
    this.createFolder = this.createFolder.bind(this)
    this.deleteFolder = this.deleteFolder.bind(this)
    this.renameFolder = this.renameFolder.bind(this)
  }

  getAllFolders = async (req: Request, res: Response) => {
    try {
      const folders = await this.service.getAllFolders()
      if (!res.headersSent) {
        res.json({
          success: true,
          data: folders
        })
      }
    } catch (error) {
      Validator.handleError(error, res)
    }
  }

  getFolderById = async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id)
      const folder = await this.service.getFolderById(id)
      if (!res.headersSent) {
        res.json({
          success: true,
          data: folder
        })
      }
    } catch (error) {
      Validator.handleError(error, res)
    }
  }

  getSubfolders = async (req: Request, res: Response) => {
    try {
      const parentId = parseInt(req.params.id)
      const subfolders = await this.service.getSubfolders(parentId)
      if (!res.headersSent) {
        res.json({
          success: true,
          data: subfolders
        })
      }
    } catch (error) {
      Validator.handleError(error, res)
    }
  }

  createFolder = async (req: Request, res: Response) => {
    try {
      const folderData: CreateFolderDto = req.body
      const newFolder = await this.service.createFolder(folderData)
      if (!res.headersSent) {
        res.status(201).json({
          success: true,
          data: newFolder
        })
      }
    } catch (error) {
      Validator.handleError(error, res)
    }
  }

  deleteFolder = async (req: Request, res: Response) => {
    try {
      const { id } = Validator.validate(FolderValidation.getFolderById, { 
        id: parseInt(req.params.id) 
      })

      const folder = await this.service.deleteFolder(id)
      
      if (!res.headersSent) {
        res.json({
          success: true,
          message: 'Folder deleted successfully',
          data: folder
        })
      }
    } catch (error) {
      Validator.handleError(error, res)
    }
  }

  renameFolder = async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id)
      const { name } = req.body

      const folder = await this.service.renameFolder(id, name)

      res.json({
        success: true,
        message: 'Folder renamed successfully',
        data: folder
      })
    } catch (error) {
      throw error
    }
  }
}

// Create a singleton instance
export const folderController = new FolderController() 