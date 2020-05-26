import { connect } from 'http2'
import axios from 'axios'
import { Readable } from 'stream'

/**
 * Returns whether or not the host computer has a network connection.
 */
export function isNetworkConnected(): Promise<boolean> {
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

export async function listStructures(): Promise<{
  frameworks: string[]
  languages: string[]
}> {
  const frameworks = (
    await axios(
      'https://api.github.com/repos/Standard-Structure/Standard-Structure/contents/frameworks'
    )
  ).data
    .filter(i => i.type === 'dir')
    .map(i => i.name)
  const languages = (
    await axios(
      'https://api.github.com/repos/Standard-Structure/Standard-Structure/contents/languages'
    )
  ).data
    .filter(i => i.type === 'dir')
    .map(i => i.name)

  return {
    frameworks,
    languages
  }
}

export async function getAllStructures(
  registry: string = 'Standard-Structure/Standard-Structure'
): Promise<Readable> {
  const stream = await axios.get(`https://api.github.com/${registry}/tarball`)
  return stream.data
}
