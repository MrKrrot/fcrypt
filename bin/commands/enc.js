import fs from 'node:fs/promises'
import path from 'node:path'
import chalk from 'chalk'

import { promptKey, Crypter, generateKey } from '../utils/index.js'

export const encCommand = async relativePath => {
  try {
    const absolutePath = process.cwd()
    const completePath = path.join(absolutePath, relativePath)
    const fileStats = await fs.stat(completePath)

    const key = await promptKey()
    const hashedKey = generateKey(key)

    if (fileStats.isFile()) {
      console.log(chalk.yellow('Encrypting file...'))
      await Crypter.encryptFile(completePath, hashedKey)
      console.log(chalk.green('File encrypted successfully'))
    }

    if (fileStats.isDirectory()) {
      console.log(chalk.yellow('Encrypting folder...'))
      await Crypter.encryptFolder(completePath, hashedKey)
      console.log(chalk.green('Folder encrypted successfully'))
    }
  } catch (err) {
    if (err.code === 'ENOENT') {
      console.log(chalk.red('The file or directory does not exist'))
    } else {
      console.log(chalk.red('An error occurred:', err.message))
    }
  }
}
