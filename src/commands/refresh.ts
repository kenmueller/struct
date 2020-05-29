import { GluegunToolbox } from 'gluegun'
import { isNetworkConnected, getCachedStructures } from '../struct'

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
        networkSpinner.succeed('Connected to the Internet')

        const refreshSpinner = spin('Refreshing cached structures...')

        await getCachedStructures().then(currentCache => {
            // TODO - Actually refresh the structures
            refreshSpinner.succeed('Cached structures refreshed:')
          info(
            `\nFrameworks:\n${currentCache.frameworks.map((value, _, __) => {
                return `\t${value}\n`;
            })}\nLanguages:\n${currentCache.languages.map((value, _, __) => {
                return `\t${value}\n`;
            })}`
          )
        })
      } else {
        networkSpinner.fail("You're not connected to the Internet. :(")
      }
    } else {
      info('Aborting.')
    }
  }
}
