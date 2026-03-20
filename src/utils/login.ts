import Taro from '@tarojs/taro'

export type LoginScene = 'miniProgram' | 'wechatH5' | 'browserH5'

export const WECHAT_H5_AUTH_URL = '/api/auth/wechat/authorize'

export function getLoginScene(): LoginScene {
  const env = Taro.getEnv()

  if (env === Taro.ENV_TYPE.WEAPP) {
    return 'miniProgram'
  }

  if (env === Taro.ENV_TYPE.WEB) {
    if (typeof window !== 'undefined' && /micromessenger/i.test(window.navigator.userAgent)) {
      return 'wechatH5'
    }
    return 'browserH5'
  }

  return 'browserH5'
}

export function getSceneConfig(scene: LoginScene) {
  if (scene === 'miniProgram') {
    return {
      badge: '小程序',
      title: '微信一键登录',
      desc: '推荐使用微信快速登录，后续可补充绑定手机号。',
      secondaryText: '手机号补充绑定'
    }
  }

  if (scene === 'wechatH5') {
    return {
      badge: '微信内 H5',
      title: '微信授权登录',
      desc: '当前在微信内打开，适合直接走微信授权登录。',
      secondaryText: '手机号验证码登录'
    }
  }

  return {
    badge: '浏览器 H5',
    title: '手机号验证码登录',
    desc: '当前在浏览器中打开，优先使用手机号验证码登录。',
    secondaryText: '去微信中打开'
  }
}

export function buildWechatH5AuthUrl() {
  if (typeof window === 'undefined') return WECHAT_H5_AUTH_URL
  const redirect = encodeURIComponent(window.location.href)
  const joiner = WECHAT_H5_AUTH_URL.includes('?') ? '&' : '?'
  return `${WECHAT_H5_AUTH_URL}${joiner}redirect=${redirect}`
}
