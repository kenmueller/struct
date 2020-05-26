import { GluegunToolbox } from 'gluegun'
import { listStructures } from '../struct'

module.exports = {
  async run(toolbox: GluegunToolbox) {
    const {
      print: { info, colors }
    } = toolbox

    const spinner = toolbox.print.spin('Loading...')

    const { frameworks, languages } = await listStructures()

    spinner.stop()

    info(colors.muted('Frameworks'))
    info(frameworks.join('\n') + '\n')

    info(colors.muted('Languages'))
    info(languages.join('\n'))
  }
}
