import { z } from "zod";

export class FolderValidation {
    static readonly createFolder = z.object({
        name: z.string()
            .nonempty("Folder name is required")
            .transform(val => val.trim())
            .refine((val) => val.length > 0, {
                message: "Folder name cannot be empty or contain only whitespace"
            })
            .refine((val) => /\S/.test(val), {
                message: "Folder name cannot be empty or contain only whitespace"
            })
            .refine((val) => val.length <= 255, {
                message: "Folder name must be less than 255 characters"
            }),
        parent_id: z.number().nullable().optional()
    });

    static readonly updateFolder = z.object({
        name: z.string()
            .nonempty("Folder name is required")
            .min(1, "Folder name cannot be empty")
            .transform(val => val.trim())
            .refine((val) => val.length > 0, {
                message: "Folder name cannot be only whitespace"
            })
            .refine((val) => val.length <= 255, {
                message: "Folder name must be less than 255 characters"
            }),
        parent_id: z.number().nullable().optional()
    });

    static readonly getFolderById = z.object({
        id: z.number().positive("Folder ID must be a positive number")
    });
} 