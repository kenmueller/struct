import { connect } from 'http2'

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
