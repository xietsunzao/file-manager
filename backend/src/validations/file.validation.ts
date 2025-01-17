import { z } from "zod";

export class FileValidation {
  static readonly createFile = z.object({
    name: z.string()
      .nonempty("File name is required")
      .transform(val => val.trim())
      .refine((val) => val.length > 0, {
        message: "File name cannot be empty or contain only whitespace"
      })
      .refine((val) => val.length <= 255, {
        message: "File name must be less than 255 characters"
      }),
    type: z.string().nonempty("File type is required"),
    size: z.number().positive("File size must be positive"),
    folder_id: z.number().positive("Folder ID is required"),
    path: z.string().nonempty("File path is required")
  });

  static readonly updateFile = z.object({
    name: z.string()
      .nonempty("File name is required")
      .transform(val => val.trim())
      .refine((val) => val.length > 0, {
        message: "File name cannot be empty or contain only whitespace"
      })
      .refine((val) => val.length <= 255, {
        message: "File name must be less than 255 characters"
      })
  });

  static readonly getFileById = z.object({
    id: z.number().positive("File ID must be a positive number")
  });

  static readonly renameFile = z.object({
    id: z.number().int().positive(),
    name: z.string().min(1).max(255)
  });

  static readonly deleteFile = z.object({
    id: z.number().int().positive()
  });
} 