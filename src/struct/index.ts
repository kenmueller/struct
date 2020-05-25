const http2 = require('http2')

/**
 * Returns whether or not the host computer has a network connection.
 * @return {boolean} Whether the host computer has a network connection
 */
export function isNetworkConnected() {
  return new Promise(resolve => {
    const client = http2.connect('https://www.google.com') // Google is a nice standard site to check network connection
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
