import { NextFunction, Request, Response } from 'express'
import { verifyToken } from '../helpers'

export const TokenParserMiddleware = async (
  req: any,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader) {
      return res.status(401).json({
        status: 401,
        message: 'Authorization header is missing',
      })
    }

    const decoded = verifyToken(authHeader)

    if (!decoded || decoded == 'error') {
      return res.status(401).json({
        status: 401,
        message: 'Unauthorized: Invalid or expired token',
      })
    }

    req.user = decoded

    next()
  } catch (error: any) {
    return res.status(401).json({
      status: 401,
      message: 'Unauthorized: Invalid or expired token',
      error: error.message,
    })
  }
}
