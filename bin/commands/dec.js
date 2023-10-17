import fs from 'node:fs/promises'
import path from 'node:path'
import chalk from 'chalk'

import { promptKey, Crypter, generateKey } from '../utils/index.js'

export const decCommand = async relativePath => {
  try {
    const absolutePath = process.cwd()
    const completePath = path.join(absolutePath, relativePath)
    const fileStats = await fs.stat(completePath)

    const key = await promptKey()
    const hashedKey = generateKey(key)

    if (fileStats.isFile()) {
      console.log(chalk.yellow('Decrypting file...'))
      await Crypter.decryptFile(completePath, hashedKey)
      console.log(chalk.green('File decrypted successfully'))
    }

    if (fileStats.isDirectory()) {
      console.log(chalk.yellow('Decrypting folder...'))
      await Crypter.decryptFolder(completePath, hashedKey)
      console.log(chalk.green('Folder decrypted successfully'))
    }
  } catch (err) {
    if (err.code === 'ENOENT') {
      console.log(chalk.red('The file or directory does not exist'))
    }
    console.log(chalk.red('An error occurred:', err.message))
  }
}
