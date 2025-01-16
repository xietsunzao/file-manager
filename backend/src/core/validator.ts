import { z } from 'zod'
import { Response } from 'express';
import { ZodError } from 'zod'

interface ValidationError {
    field: string;
    code: string;
    message: string;
    details?: Record<string, any>;
}

export class Validator {
    static validate<T>(schema: z.ZodSchema<T>, data: unknown): T {
        try {
            return schema.parse(data);
        } catch (error) {
            if (error instanceof z.ZodError) {
                const formattedErrors: ValidationError[] = error.errors.map(err => ({
                    field: err.path.join('.'),
                    code: err.code,
                    message: err.message,
                    details: {
                        ...err,
                        path: undefined,
                        code: undefined,
                        message: undefined
                    }
                }));
                
                throw new Error(JSON.stringify({
                    success: false,
                    message: "Validation failed",
                    errors: formattedErrors
                }));
            }
            throw error;
        }
    }

    static handleError(error: unknown, res: Response) {
        if (res.headersSent) {
            console.error('Headers already sent:', error)
            return
        }

        if (error instanceof ZodError) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: error.errors.map(err => ({
                    field: err.path.join('.'),
                    message: err.message
                }))
            })
        }

        try {
            const parsedError = JSON.parse(error instanceof Error ? error.message : String(error))
            if (parsedError.success === false) {
                return res.status(400).json(parsedError)
            }
        } catch (e) {
            // Not a JSON string, continue to default error
        }

        console.error('Unhandled error:', error)
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            errors: [{
                field: 'server',
                message: error instanceof Error ? error.message : 'Unknown error occurred'
            }]
        })
    }

    static async validateAsync<T>(schema: z.ZodSchema<T>, data: unknown): Promise<T> {
        try {
            return await schema.parseAsync(data);
        } catch (error) {
            if (error instanceof z.ZodError) {
                const formattedErrors: ValidationError[] = error.errors.map(err => ({
                    field: err.path.join('.'),
                    code: err.code,
                    message: err.message,
                    details: {
                        ...err,
                        path: undefined,
                        code: undefined,
                        message: undefined
                    }
                }));
                
                throw new Error(JSON.stringify({
                    success: false,
                    message: "Validation failed",
                    errors: formattedErrors
                }));
            }
            throw error;
        }
    }
} 