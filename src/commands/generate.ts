import { GluegunToolbox } from 'gluegun'
import { extract } from 'tar'
import {
  getAllStructures,
  copyFilesRecursively,
  isNetworkConnected
} from '../struct'
import * as os from 'os'
import * as fs from 'fs'
import * as path from 'path'

module.exports = {
  name: 'generate',
  alias: ['g'],
  run: async (toolbox: GluegunToolbox) => {
    const {
      print: { spin, error },
      prompt
    } = toolbox

    const resp = await prompt.ask([
      {
        type: 'select',
        name: 'type',
        message: 'Would you like to generate a language or a framework?',
        choices: ['Language', 'Framework']
      },
      {
        type: 'input',
        name: 'name',
        message: 'Which language/framework would you like to generate?'
      },
      {
        type: 'input',
        initial: '.',
        name: 'location',
        message: 'Where would you like to create your project?'
      }
    ])

    const structureName = path.join(
      `${resp.type === 'Framework' ? 'frameworks' : 'languages'}`,
      resp.name,
      'basic'
    )

    const cacheHome = path.join(`${os.homedir}`, '.struct', 'caches')

    const structureCachePath = path.join(cacheHome, structureName)

    fs.access(structureCachePath, fs.constants.F_OK, async err => {
      if (err) {
        if (err.code === 'ENOENT') {
          if (await isNetworkConnected()) {
            const downloadSpinner = spin('Downloading repo...')

            const stream = await getAllStructures()

            downloadSpinner.succeed('Downloaded!')
            const unpackSpinner = spin('Unpacking to cache...')

            try {
              fs.accessSync(structureCachePath, fs.constants.F_OK)
            } catch (err) {
              fs.mkdirSync(structureCachePath, {
                recursive: true
              })
            }

            stream
              .pipe(
                extract({
                  C: structureCachePath,
                  strip: 4,
                  // eslint-disable-next-line @typescript-eslint/no-unused-vars
                  filter: (path, entry) => {
                    return path.includes(structureName)
                  }
                })
              )
              .on('end', () => {
                unpackSpinner.succeed(
                  `Unpacked structure to cache at ${structureCachePath}`
                )
                const cacheGenerateSpinner = spin(
                  'Generating structure from cached folder...'
                )
                copyFilesRecursively(structureCachePath, resp.location)
                cacheGenerateSpinner.succeed(
                  `Structure generated at ${resp.location}! Happy coding!`
                )
              })
          } else {
            error(
              `You don't have the structure for ${resp.name} cached locally. Please try again once you are connected to the Internet.`
            )
          }
        } else {
          throw err
        }
      } else {
        const cacheGenerateSpinner = spin(
          'Generating structure from cached folder...'
        )
        copyFilesRecursively(structureCachePath, resp.location)
        cacheGenerateSpinner.succeed(
          `Structure generated at ${resp.location}! Happy coding!`
        )
      }
    })
  }
}
