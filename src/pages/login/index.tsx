import React, { useMemo, useState } from 'react'
import Taro, { useLoad } from '@tarojs/taro'
import { View, Text, Button, Checkbox, CheckboxGroup } from '@tarojs/components'
import { buildWechatH5AuthUrl, getLoginScene, getSceneConfig, LoginScene } from '../../utils/login'
import './index.scss'

const LoginPage: React.FC = () => {
  const [scene, setScene] = useState<LoginScene>('browserH5')
  const [agreed, setAgreed] = useState(true)
  const sceneConfig = useMemo(() => getSceneConfig(scene), [scene])

  useLoad(() => {
    setScene(getLoginScene())
  })

  const handleMiniProgramLogin = async () => {
    try {
      Taro.showLoading({ title: '登录中...' })
      const res = await Taro.login()
      Taro.hideLoading()

      if (!res.code) {
        Taro.showToast({ title: '未获取到登录 code', icon: 'none' })
        return
      }

      await Taro.showModal({
        title: '已获取微信登录 code',
        content: `前端已成功获取 code：${res.code}\n\n下一步请把 code 发给后端换取登录态。`,
        showCancel: false
      })
    } catch (error) {
      Taro.hideLoading()
      Taro.showToast({ title: '微信登录失败', icon: 'none' })
    }
  }

  const handleWechatH5Login = () => {
    if (typeof window !== 'undefined') {
      window.location.href = buildWechatH5AuthUrl()
    }
  }

  const handleBrowserPhoneLogin = () => {
    Taro.navigateTo({ url: '/pages/phone-login/index' })
  }

  const handleOpenInWechat = () => {
    Taro.showModal({
      title: '建议操作',
      content: '当前是外部浏览器环境。若你希望使用微信授权登录，请复制链接到微信中打开。',
      showCancel: false
    })
  }

  const handlePrimaryLogin = () => {
    if (!agreed) {
      Taro.showToast({ title: '请先同意协议', icon: 'none' })
      return
    }

    if (scene === 'miniProgram') {
      handleMiniProgramLogin()
      return
    }

    if (scene === 'wechatH5') {
      handleWechatH5Login()
      return
    }

    handleBrowserPhoneLogin()
  }

  const handleSecondaryAction = () => {
    if (!agreed) {
      Taro.showToast({ title: '请先同意协议', icon: 'none' })
      return
    }

    if (scene === 'browserH5') {
      handleOpenInWechat()
      return
    }

    Taro.navigateTo({ url: '/pages/phone-login/index' })
  }

  return (
    <View className='login-page'>
      <View className='login-bg-glow glow-1' />
      <View className='login-bg-glow glow-2' />

      <View className='login-card'>
        <View className='login-badge'>{sceneConfig.badge}</View>

        <View className='login-logo'>
          <Text className='login-logo-text'>玄</Text>
        </View>

        <View className='login-title'>登录未来超级展望师</View>
        <View className='login-subtitle'>
          自动识别当前运行环境，为你提供更低阻力的登录方式
        </View>

        <View className='login-benefit-card'>
          <View className='benefit-title'>登录后你会获得</View>
          <View className='benefit-item'>• 保存历史结果与已购内容</View>
          <View className='benefit-item'>• 同步个性化偏好设置</View>
          <View className='benefit-item'>• 领取后续提醒与限定内容</View>
        </View>

        <View className='login-current-card'>
          <View className='current-label'>当前推荐路径</View>
          <View className='current-title'>{sceneConfig.title}</View>
          <View className='current-desc'>{sceneConfig.desc}</View>
        </View>

        <Button className='primary-btn' onClick={handlePrimaryLogin}>
          {sceneConfig.title}
        </Button>

        <Button className='secondary-btn' onClick={handleSecondaryAction}>
          {sceneConfig.secondaryText}
        </Button>

        <View className='scene-tips'>
          <View className='scene-tip'>
            <Text className='scene-name'>小程序</Text>
            <Text className='scene-desc'>主按钮：微信一键登录</Text>
          </View>
          <View className='scene-tip'>
            <Text className='scene-name'>微信内 H5</Text>
            <Text className='scene-desc'>主按钮：微信授权登录</Text>
          </View>
          <View className='scene-tip'>
            <Text className='scene-name'>浏览器 H5</Text>
            <Text className='scene-desc'>主按钮：手机号验证码登录</Text>
          </View>
        </View>

        <View className='agreement-row' onClick={() => setAgreed(!agreed)}>
          <CheckboxGroup>
            <Checkbox value='agree' checked={agreed} color='#d8b06a' />
          </CheckboxGroup>
          <Text className='agreement-text'>
            我已阅读并同意《用户协议》与《隐私政策》
          </Text>
        </View>

        <View className='agreement-desc'>
          不同终端登录后，将统一归并到同一账号体系。
        </View>
      </View>
    </View>
  )
}

export default LoginPage
