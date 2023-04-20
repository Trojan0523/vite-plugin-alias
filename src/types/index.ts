
export interface PluginOptions {
  /**
   * root for resolving project paths, accept custom config for project root, we will use viteConfig.root by default
   */
  root?: string,
  /**
   * TODO: support for multiple .json file for different side, like node site ssr side .etc (tsconfig.node.json, tsconfig.build.json)
   */
  projects?: Array<string>,
  /**
   * allow using typeScript and JavaScript module, then enhance Vue templates to be resolved or when `allowJs: true` in your tsconfig isn`t good enough
   */
  loose?: boolean,
}

export interface TSConfig {
  include?: Array<string>,
  exclude?: Array<string>,
  compilerOptions?: {
    baseUrl?: string,
    paths?: Record<string, Array<string>>,
    allowJs?: boolean,
    checkJs?: boolean
    outDir?: string,
  },
}
