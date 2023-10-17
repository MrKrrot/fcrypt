import { createCipheriv, createDecipheriv } from 'node:crypto'
import { readFile, readdir, stat, unlink, writeFile } from 'node:fs/promises'
import { algorithm, iv } from '../constants/index.js'
import { join } from 'node:path'
import chalk from 'chalk'

export class Crypter {
  static async encryptFile(filePath, encryptionKey) {
    const fileData = await readFile(filePath)
    const cipher = createCipheriv(algorithm, encryptionKey, iv)

    const encryptedData = Buffer.concat([
      iv,
      cipher.update(fileData),
      cipher.final('')
    ])

    const encryptedFilePath = `${filePath}.enc`
    await writeFile(encryptedFilePath, encryptedData)
    await unlink(filePath)
  }

  static async encryptFolder(folderPath, encryptionKey) {
    const files = await readdir(folderPath)

    for (const file of files) {
      const filePath = join(folderPath, file)

      const fileStats = await stat(filePath)

      if (fileStats.isFile()) {
        await this.encryptFile(filePath, encryptionKey)
      }

      if (fileStats.isDirectory()) {
        await this.encryptFolder(filePath, encryptionKey)
      }
    }
  }

  static async decryptFile(filePath, encryptionKey) {
    const fileData = await readFile(filePath)

    const iv = fileData.slice(0, 16)
    const encryptedData = fileData.slice(16)
    const decipher = createDecipheriv(algorithm, encryptionKey, iv)

    try {
      const decryptedData = Buffer.concat([
        decipher.update(encryptedData),
        decipher.final()
      ])

      const decryptedFilePath = filePath.replace('.enc', '')
      await writeFile(decryptedFilePath, decryptedData)
      await unlink(filePath)
    } catch (err) {
      console.log(chalk.red('Incorrect key'))
      process.exit(1)
    }
  }

  static async decryptFolder(folderPath, encryptionKey) {
    const files = await readdir(folderPath)

    for (const file of files) {
      const filePath = join(folderPath, file)

      const fileStats = await stat(filePath)

      if (fileStats.isFile() && filePath.endsWith('.encrypted')) {
        await this.decryptFile(filePath, encryptionKey)
      }

      if (fileStats.isDirectory()) {
        await this.decryptFolder(filePath, encryptionKey)
      }
    }
  }
}
