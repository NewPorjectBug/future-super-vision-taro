import { useState, useEffect } from 'react'
import Taro, { useLoad } from '@tarojs/taro'
import { View, Text, Input, Button, Image } from '@tarojs/components'
import './index.scss'

// API 基础地址
const API_BASE = process.env.NODE_ENV === 'production' 
  ? 'http://106.15.230.201:3000'
  : 'http://localhost:3000'

export default function Login() {
  const [envType, setEnvType] = useState('h5')
  const [phone, setPhone] = useState('')
  const [code, setCode] = useState('')
  const [countdown, setCountdown] = useState(0)
  const [loading, setLoading] = useState(false)

  useLoad(() => {
    // 检测运行环境
    detectEnvironment()
  })

  useEffect(() => {
    // 检查是否已登录
    const token = Taro.getStorageSync('token')
    if (token) {
      // 已登录，跳转到首页
      Taro.redirectTo({ url: '/pages/home/index' })
    }
  }, [])

  useEffect(() => {
    let timer: any
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000)
    }
    return () => clearTimeout(timer)
  }, [countdown])

  // 检测运行环境
  const detectEnvironment = () => {
    // 微信小程序环境
    // @ts-ignore
    if (process.env.TARO_ENV === 'weapp') {
      setEnvType('wechat')
      // 微信小程序直接登录
      wechatLogin()
      return
    }

    // 检测是否为PC端
    const systemInfo = Taro.getSystemInfoSync()
    const isPC = systemInfo.platform === 'windows' || 
                 systemInfo.platform === 'mac' || 
                 systemInfo.windowWidth > 768
    
    setEnvType(isPC ? 'pc' : 'h5')
  }

  // 微信小程序登录
  const wechatLogin = async () => {
    try {
      setLoading(true)
      
      // 获取登录凭证
      const loginRes = await Taro.login()
      
      if (!loginRes.code) {
        throw new Error('Failed to get login code')
      }

      // 发送到后端
      const res = await Taro.request({
        url: API_BASE + '/api/auth/wechat',
        method: 'POST',
        data: { code: loginRes.code }
      })

      if (res.data.code === 200) {
        // 保存token
        Taro.setStorageSync('token', res.data.data.token)
        Taro.setStorageSync('userInfo', res.data.data.user)
        
        Taro.showToast({ title: '登录成功', icon: 'success' })
        
        // 跳转到首页
        setTimeout(() => {
          Taro.redirectTo({ url: '/pages/home/index' })
        }, 1000)
      } else {
        throw new Error(res.data.message)
      }
    } catch (error: any) {
      console.error('Login error:', error)
      Taro.showToast({ title: error.message || '登录失败', icon: 'error' })
    } finally {
      setLoading(false)
    }
  }

  // 发送验证码
  const sendSmsCode = async () => {
    if (!phone || !/^1[3-9]\d{9}$/.test(phone)) {
      Taro.showToast({ title: '请输入正确的手机号', icon: 'error' })
      return
    }

    try {
      setLoading(true)
      
      const res = await Taro.request({
        url: API_BASE + '/api/auth/sms',
        method: 'POST',
        data: { phone }
      })

      if (res.data.code === 200) {
        Taro.showToast({ title: '验证码已发送', icon: 'success' })
        setCountdown(60)
        
        // 开发环境显示验证码
        if (res.data.data.code) {
          console.log('验证码:', res.data.data.code)
          Taro.showModal({
            title: '开发模式',
            content: '验证码: ' + res.data.data.code,
            showCancel: false
          })
        }
      } else {
        throw new Error(res.data.message)
      }
    } catch (error: any) {
      console.error('SMS error:', error)
      Taro.showToast({ title: error.message || '发送失败', icon: 'error' })
    } finally {
      setLoading(false)
    }
  }

  // 手机号登录
  const phoneLogin = async () => {
    if (!phone || !/^1[3-9]\d{9}$/.test(phone)) {
      Taro.showToast({ title: '请输入正确的手机号', icon: 'error' })
      return
    }

    if (!code || code.length !== 6) {
      Taro.showToast({ title: '请输入6位验证码', icon: 'error' })
      return
    }

    try {
      setLoading(true)
      
      const res = await Taro.request({
        url: API_BASE + '/api/auth/phone',
        method: 'POST',
        data: { phone, code }
      })

      if (res.data.code === 200) {
        // 保存token
        Taro.setStorageSync('token', res.data.data.token)
        Taro.setStorageSync('userInfo', res.data.data.user)
        
        Taro.showToast({ title: '登录成功', icon: 'success' })
        
        // 跳转到首页
        setTimeout(() => {
          Taro.redirectTo({ url: '/pages/home/index' })
        }, 1000)
      } else {
        throw new Error(res.data.message)
      }
    } catch (error: any) {
      console.error('Login error:', error)
      Taro.showToast({ title: error.message || '登录失败', icon: 'error' })
    } finally {
      setLoading(false)
    }
  }

  // 微信扫码登录（PC端）
  const wechatQrLogin = () => {
    // PC端微信扫码登录需要跳转到微信OAuth页面
    const appId = 'your-app-id' // 需要替换为实际的appid
    const redirectUri = encodeURIComponent(window.location.origin + '/pages/login/callback')
    const scope = 'snsapi_login'
    const state = Math.random().toString(36).substring(7)
    
    // 保存state用于验证
    Taro.setStorageSync('wechat_oauth_state', state)
    
    const url = 'https://open.weixin.qq.com/connect/qrconnect?appid=' + appId + '&redirect_uri=' + redirectUri + '&response_type=code&scope=' + scope + '&state=' + state + '#wechat_redirect'
    
    window.location.href = url
  }

  // 微信小程序登录页面
  if (envType === 'wechat') {
    return (
      <View className='login-page wechat-login'>
        <View className='loading-container'>
          <View className='loading'></View>
          <Text className='loading-text'>正在登录...</Text>
        </View>
      </View>
    )
  }

  // H5/PC 登录页面
  return (
    <View className='login-page'>
      <View className='login-container'>
        <View className='logo-section'>
          <Text className='app-name'>未来超级展望师</Text>
          <Text className='app-slogan'>探索你的未来运势</Text>
        </View>

        <View className='login-form'>
          <View className='input-group'>
            <Text className='input-label'>手机号</Text>
            <Input
              className='phone-input'
              type='number'
              placeholder='请输入手机号'
              value={phone}
              onInput={(e) => setPhone(e.detail.value)}
              maxlength={11}
            />
          </View>

          <View className='input-group'>
            <Text className='input-label'>验证码</Text>
            <View className='code-input-wrapper'>
              <Input
                className='code-input'
                type='number'
                placeholder='请输入验证码'
                value={code}
                onInput={(e) => setCode(e.detail.value)}
                maxlength={6}
              />
              <Button
                className={'send-code-btn ' + (countdown > 0 ? 'disabled' : '')}
                onClick={sendSmsCode}
                disabled={countdown > 0 || loading}
              >
                {countdown > 0 ? countdown + 's' : '获取验证码'}
              </Button>
            </View>
          </View>

          <Button
            className='login-btn'
            onClick={phoneLogin}
            disabled={loading}
          >
            {loading ? '登录中...' : '登录'}
          </Button>
        </View>

        {envType === 'pc' && (
          <View className='other-login'>
            <View className='divider'>
              <View className='line'></View>
              <Text className='text'>其他登录方式</Text>
              <View className='line'></View>
            </View>
            <Button className='wechat-qr-btn' onClick={wechatQrLogin}>
              <Text className='icon'>📱</Text>
              <Text>微信扫码登录</Text>
            </Button>
          </View>
        )}

        <View className='tips'>
          <Text>未注册手机号验证后将自动创建账号</Text>
        </View>
      </View>
    </View>
  )
}
