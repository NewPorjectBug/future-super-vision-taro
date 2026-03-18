import { defineConfig } from '@tarojs/cli'
import devConfig from './dev'
import prodConfig from './prod'

export default defineConfig<'vite'>({
  projectName: 'future-super-vision-taro-complete',
  date: '2026-03-18',
  designWidth: 750,
  deviceRatio: {
    640: 2.34 / 2,
    750: 1,
    828: 1.81 / 2,
  },
  sourceRoot: 'src',
  outputRoot: 'dist',
  framework: 'react',
  compiler: 'vite',
  plugins: [],
  defineConstants: {},
  copy: {
    patterns: [],
    options: {},
  },
  mini: {
    postcss: {
      autoprefixer: {
        enable: true,
      },
      url: {
        enable: true,
        config: {
          limit: 1024,
        },
      },
      cssModules: {
        enable: false,
      },
    },
  },
  h5: {
    publicPath: '/',
    staticDirectory: 'static',
    router: {
      mode: 'hash',
    },
    esnextModules: [],
  },
}, (merge, { command }) => {
  if (command === 'build') {
    return merge({}, prodConfig)
  }
  return merge({}, devConfig)
})
