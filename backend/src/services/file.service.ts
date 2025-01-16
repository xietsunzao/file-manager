import { FileRepository } from '../repositories/file.repository'
import { FileValidation } from '../validations/file.validation'
import { Validator } from '../core/validator'
import type { File, Prisma } from '@prisma/client'

export class FileService {
  private repository: FileRepository

  constructor() {
    this.repository = new FileRepository()
  }

  async getFiles(folder_id?: number): Promise<File[]> {
    return await this.repository.findAll(folder_id)
  }

  async getFileById(id: number): Promise<File> {
    const file = await this.repository.findById(id)
    if (!file) {
      throw new Error(JSON.stringify({
        success: false,
        message: 'File not found',
        errors: [{
          field: 'id',
          message: 'File not found'
        }]
      }))
    }
    return file
  }

  async createFile(data: any): Promise<File> {
    const validData = await Validator.validateAsync(FileValidation.createFile, data)
    
    // Transform the data to match Prisma's FileCreateInput type
    const fileData: Prisma.FileCreateInput = {
      name: validData.name,
      type: validData.type,
      size: validData.size,
      path: validData.path,
      folder: {
        connect: {
          id: validData.folder_id
        }
      }
    }

    return await this.repository.create(fileData)
  }

  async updateFile(id: number, data: any): Promise<File> {
    const validData = await Validator.validateAsync(FileValidation.updateFile, data)
    
    const file = await this.repository.findById(id)
    if (!file) {
      throw new Error(JSON.stringify({
        success: false,
        message: 'File not found',
        errors: [{
          field: 'id',
          message: 'File not found'
        }]
      }))
    }

    // Transform the data to match Prisma's FileUpdateInput type
    const fileData: Prisma.FileUpdateInput = {
      name: validData.name
    }

    return await this.repository.update(id, fileData)
  }

  async deleteFile(id: number): Promise<File> {
    const file = await this.repository.findById(id)
    if (!file) {
      throw new Error(JSON.stringify({
        success: false,
        message: 'File not found',
        errors: [{
          field: 'id',
          message: 'File not found'
        }]
      }))
    }

    return await this.repository.delete(id)
  }
} 