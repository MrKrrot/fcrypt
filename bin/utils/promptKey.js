import inquirer from 'inquirer'

export const promptKey = async () => {
  const { password } = await inquirer.prompt([
    {
      type: 'password',
      name: 'password',
      message: 'Enter a key to encrypt the files:',
      mask: '*'
    }
  ])
  return password
}
