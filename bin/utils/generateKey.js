import crypto from 'node:crypto'

export const generateKey = password => {
  return crypto
    .createHash('sha256')
    .update(password)
    .digest()
    .toString('hex')
    .slice(0, 32)
}
