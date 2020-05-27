import { GluegunToolbox } from 'gluegun'
import { listStructures } from '../struct'

module.exports = {
  async run(toolbox: GluegunToolbox) {
    const {
      print: { table, colors }
    } = toolbox

    const spinner = toolbox.print.spin('Loading...')

    const { frameworks, languages } = await listStructures()

    spinner.stop()

    let tableData = []

    for (
      let i = 0;
      i <
      (frameworks.length > languages.length
        ? frameworks.length
        : languages.length);
      i++
    ) {
      let framework: string
      let language: string

      try {
        framework = frameworks[i]
      } catch (e) {
        framework = null
      }

      try {
        language = languages[i]
      } catch (e) {
        language = null
      }

      tableData.push([framework, language])
    }

    table(
      [[colors.muted('Frameworks'), colors.muted('Languages')], ...tableData],
      { format: 'default' }
    )
  }
}
