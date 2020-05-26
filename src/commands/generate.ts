import { GluegunToolbox } from 'gluegun'
import { extract } from 'tar'
import { getAllStructures } from '../struct'

module.exports = {
  name: 'generate',
  alias: ['g'],
  run: async (toolbox: GluegunToolbox) => {
    const {
      print: { spin },
      prompt
    } = toolbox

    let resp = await prompt.ask([
      {
        type: 'select',
        name: 'type',
        message: 'Would you like to download a language or framework?',
        choices: ['Language', 'Framework']
      },
      {
        type: 'input',
        name: 'name',
        message: `Which language/framework would you like to generate?`
      },
      {
        type: 'input',
        initial: '.',
        name: 'location',
        message: 'Where would you like to create your project?'
      }
    ])

    const spinner = spin('Downloading repo...')

    const stream = await getAllStructures()

    spinner.succeed('Downloaded!')
    const unpackSpinner = spin('Unpacking...')

    stream
      .pipe(
        extract({
          C: resp.location || process.cwd(),
          strip: 4,
          filter: (path, entry) => {
            if (resp.type === 'Framework') {
              return path.includes(`frameworks/${resp.name}/basic`)
            } else {
              return path.includes(`languages/${resp.name}/basic`)
            }
          }
        })
      )
      .on('end', () => {
        unpackSpinner.succeed('Success!')
      })
  }
}
