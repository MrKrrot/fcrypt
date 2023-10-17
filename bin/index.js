#!/usr/bin/env node
import { Command } from 'commander'

import { encCommand, decCommand } from './commands/index.js'

const program = new Command()

program
  .name('fcrypt')
  .version('1.0.1')
  .description('A simple CLI tool to encrypt and decrypt files and folders')

program
  .command('enc')
  .description('Encrypt files in the specified folder')
  .argument('<path>', 'File or folder path to encrypt')
  .action(encCommand)

program
  .command('dec')
  .description('Decrypt files in the specified folder')
  .argument('<path>', 'File or folder path to decrypt')
  .action(decCommand)

program.parse(process.argv)
