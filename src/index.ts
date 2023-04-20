import { Plugin, searchForWorkspaceRoot } from 'vite'
// import { } from './utils/mapping-paths'
import { parse } from 'tsconfck'
import { PluginOptions } from './types'
import { resolve } from 'path'


const configAliasPlugin = (options: PluginOptions = {}): Plugin => {
  let resolvedConfig
  return {
    name: 'vite-plugin',
    enforce: 'post',
    async configResolved(config) {
      let projectRoot = config.root
      let workspaceRoot!: string
      let { root } = options
      // 解析路径下的tsconfig.json
      const data = await parse(resolve(__dirname, `${projectRoot}/tsconfig.json`))
      if (data.tsconfig.compilerOptions.paths) {
        console.log('data', data.tsconfig.compilerOptions.paths)
        // 匹配 /*的正则
        const reg = /(?<=)\/\*/g
        const findAndReplacementMapping = {}
        Object.entries(data.tsconfig.compilerOptions.paths).map(([key, value]) => {
          const findKey = key.replace(reg, '')
          console.log('kv', findKey, value)
          Object.assign(findAndReplacementMapping, {
            [findKey]: value,
          })
        })
      }
      if (root) {
        root = resolve(projectRoot, root)
      } else {
        // 给最近的monorepo workspace 找根目录
        workspaceRoot = searchForWorkspaceRoot(projectRoot)
      }

      if (root) {
        projectRoot = root
        workspaceRoot = root
      }
      // if (options.root) {
      //   const
      // }
      console.log('config', config)
      resolvedConfig = config
    },

  }
}

export default configAliasPlugin
