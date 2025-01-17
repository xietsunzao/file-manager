import { z } from "zod";

export const FileValidation = {
  createFile: z.object({
    name: z.string().min(1, 'File name is required'),
    type: z.string().min(1, 'File type is required'),
    size: z.number(),
    folder_id: z.number().int().positive('Folder ID must be positive'),
    path: z.string().min(1, 'File path is required')
  }),

  updateFile: z.object({
    name: z.string().min(1, 'File name is required').optional(),
    type: z.string().min(1, 'File type is required').optional(),
    size: z.number().optional(),
    folder_id: z.number().int().positive('Folder ID must be positive').optional(),
    path: z.string().min(1, 'File path is required').optional()
  }),

  getFileById: z.object({
    id: z.number().int().positive('File ID must be positive')
  })
} 