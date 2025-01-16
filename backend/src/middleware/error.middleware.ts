import { Request, Response, NextFunction } from 'express'
import { Validator } from '../core/validator'

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Error:', error)
  Validator.handleError(error, res)
} 