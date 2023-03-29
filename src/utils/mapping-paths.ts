import { resolve } from 'path'

const _resolve = (targetRelativePath: string) => {
  return resolve(__dirname, targetRelativePath)
}

