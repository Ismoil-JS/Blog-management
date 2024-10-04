import jwt, { JwtPayload } from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'blogmanagement'

export function generateToken(id: string): string {
  return jwt.sign({ id }, JWT_SECRET, {
    expiresIn: '72h', // Token expires in 72 hours
  })
}

export function verifyToken(token: string): JwtPayload | string {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch (error) {
    return 'error'
  }
}
