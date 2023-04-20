/*
 * @Author: BuXiongYu
 * @Date: 2023-03-29 10:11:12
 * @LastEditors: BuXiongYu
 * @LastEditTime: 2023-04-13 10:55:56
 * @Description: 请填写简介
 */
import {
  Plugin, searchForWorkspaceRoot, ResolvedConfig, normalizePath,
} from 'vite'
import { parseNative, parse } from 'tsconfck'
import { resolve } from 'path'

// TODO: debug 有点困难，所以要加个debug工具方便调试

type ViteResolve = (id: string, importer: string) => Promise<string | undefined>

type Resolver = (
  viteResolve: ViteResolve,
  id: string,
  importer: string
) => Promise<[resolved: string | undefined, matched: boolean]>

const aliasTransformPlugin = (): Plugin => {
  let config: ResolvedConfig

  return {
    name: 'vite-plugin-alias',
    enforce: 'pre',
    async configResolved(resolvedConfig) {
      const projectRoot = resolvedConfig.root
      console.log('resolvedConfig', resolvedConfig.resolve, projectRoot)
      // 解析路径下的tsconfig.json
      // TODO: 需要做路径规范化，Windows的POSIX需要做转换
      const data = await parseNative(resolve(__dirname, `${projectRoot}/tsconfig.json`))
      if (data.tsconfig && data.tsconfig.compilerOptions && data.tsconfig.compilerOptions.paths) {
        console.log('data', data.tsconfig.compilerOptions.paths)
        // 匹配 /*的正则
        // const regExpression = /\/\*+[\s\S]*?\*+\/|\/\/.*/g
        const reg = /(?<=)\/\*/g
        // 下面是用来解析paths key/values的
        const findAndReplacementMapping = {}
        Object.entries(data.tsconfig.compilerOptions.paths).map(([key, value]) => {
          const findKey = key.replace(reg, '')
          const replacement = (value as Array<string>).map((item) => item.replace(reg, ''))
          // TODO: value特殊处理，现在还不知道为啥tsconfig支持传入一个数组，是不是映射规则支持这样做
          // 取数组的第一个
          if (Array.isArray(replacement) && replacement.length === 1) {
            const [resultPath] = replacement
            Object.assign(findAndReplacementMapping, {
              [findKey]: resolve(__dirname, resultPath),
            })
          }
        })
        const aliasPathList = Object.entries(findAndReplacementMapping).reduce((previous: Array<{ find: string, replacement: string }>, [key, value]) => {
          previous.push({
            find: key,
            replacement: value as string,
          })
          return previous
        }, [])
        console.log('result', aliasPathList)
        // deep-merge
        Object.assign(resolvedConfig.resolve, {
          alias: resolvedConfig.resolve?.alias.concat(aliasPathList),
        })
        console.log('resolvedConfig.resolve', resolvedConfig.resolve?.alias)
      }
      // console.log('resolvedConfig', resolvedConfig)
      config = resolvedConfig
      console.log('config', config.resolve)
    },
    async resolveId(id, importer) {
      if (importer) {
        console.log('Result ID', { id, importer })
      }
    },
    load(this) {
      console.log('this', this.resolve)
    },
    options(options) {
      console.log('options', options)
    },
  }
}

export default aliasTransformPlugin
