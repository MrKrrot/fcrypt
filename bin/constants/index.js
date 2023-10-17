import { randomBytes } from 'node:crypto'

const iv = randomBytes(16)
const algorithm = 'aes-256-cbc'

export { algorithm, iv }