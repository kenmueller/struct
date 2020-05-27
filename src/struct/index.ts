import { connect } from 'http2'
import axios from 'axios'
import { Readable } from 'stream'
import * as fs from 'fs'

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
    if (dirent.isFile) {
      fs.mkdirSync(`${dest}`, { recursive: true })
      fs.copyFileSync(`${src}/${dirent.name}`, `${dest}/${dirent.name}`)
    } else if (dirent.isDirectory) {
      copyFilesRecursively(`${src}/${dirent.name}`, `${dest}/${dirent.name}`)
    }
  }
}
