import { NextFunction, Request, Response } from 'express'
import { z, ZodError } from 'zod'

export function validateReqBody(schema: z.ZodObject<any, any>) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = req.body
      const parsedValues = schema.parse(body)
      req.body = parsedValues
      next()
    } catch (error) {
      if (error instanceof ZodError) {
        const errorDetails = error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        }))

        return res.status(400).json({
          message: 'Bad Request',
          errors: errorDetails,
        })
      }

      return res.status(400).json({
        message: 'Bad Request',
        errors: ['Invalid search params'],
      })
    }
  }
}
