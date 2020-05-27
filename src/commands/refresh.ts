import { GluegunToolbox } from 'gluegun'
import { isNetworkConnected } from '../struct'

module.exports = {
  name: 'refresh',
  alias: ['r', 'reload'],
  run: async (toolbox: GluegunToolbox) => {
    const {
      print: { info, spin },
      prompt: { confirm }
    } = toolbox

    if (await confirm('Are you sure you want to refresh your cache?')) {
      const networkSpinner = spin('Checking network connection...')

      if (await isNetworkConnected()) {
        networkSpinner.succeed('Connected')
      } else {
        networkSpinner.fail('Not connected')
      }
    } else {
      info('Aborting.')
    }
  }
}
