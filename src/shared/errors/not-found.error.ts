export class NotFoundError extends Error {
  public status: number

  constructor(message: string) {
    super(message)
    this.name = 'NotFoundError'
    this.message = message
    this.status = 404
  }
}
