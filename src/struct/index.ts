import { connect } from 'http2'
import axios from 'axios'
import { Readable } from 'stream'

import * as fs from 'fs'
import * as os from 'os'
import * as path from 'path'

export const cacheHome = path.join(os.homedir(), '.struct', 'caches')

/**
 * Returns whether or not the host computer has a network connection.
 */
export async function isNetworkConnected(): Promise<boolean> {
  return new Promise(resolve => {
    const client = connect('https://www.google.com') // Google is a nice standard site to check network connection
    client.on('connect', () => {
      resolve(true)
      client.destroy()
    })
    client.on('error', () => {
      resolve(false)
      client.destroy()
    })
  })
}

export async function listStructures(
  registry: string = 'Standard-Structure/Standard-Structure'
): Promise<{
  frameworks: string[]
  languages: string[]
}> {
  const [frameworks, languages] = (
    await Promise.all([
      axios(`https://api.github.com/repos/${registry}/contents/frameworks`),
      axios(`https://api.github.com/repos/${registry}/contents/languages`)
    ])
  )
    .map(resp => resp.data)
    .map(i => {
      return i.filter(x => x.type === 'dir').map(x => x.name)
    })

  return {
    frameworks,
    languages
  }
}

export async function getAllStructures(
  registry: string = 'Standard-Structure/Standard-Structure'
): Promise<Readable> {
  const stream = await axios.get(
    `https://api.github.com/repos/${registry}/tarball`,
    { responseType: 'stream' }
  )
  return stream.data
}

export function copyFilesRecursively(src: string, dest: string) {
  const dirents = fs.readdirSync(src, { withFileTypes: true })

  for (const dirent of dirents) {
    if (dirent.isFile()) {
      fs.mkdirSync(dest, { recursive: true })
      fs.copyFileSync(path.join(src, dirent.name), path.join(dest, dirent.name))
    } else if (dirent.isDirectory()) {
      copyFilesRecursively(
        path.join(src, dirent.name),
        path.join(dest, dirent.name)
      )
    }
  }
}

export async function getCachedStructures(): Promise<{
  frameworks: string[]
  languages: string[]
}> {
  return {
    frameworks: [
      ...(await readdirIfExists(path.join(cacheHome, 'frameworks'))).map(i => i)
    ],
    languages: [
      ...(await readdirIfExists(path.join(cacheHome, 'languages'))).map(i => i)
    ]
  }
}

export async function readdirIfExists(
  directoryPath: string
): Promise<string[]> {
  try {
    return [...fs.readdirSync(directoryPath)]
  } catch (error) {
    if (error.code === 'ENOENT') {
      return []
    } else {
      throw error
    }
  }
}
