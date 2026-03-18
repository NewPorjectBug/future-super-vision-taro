import { Button, Text, View } from '@tarojs/components'
import Taro, { useLoad } from '@tarojs/taro'
import { useState } from 'react'
import './index.scss'

const benefits = [
  { title: '趋势解读', desc: '看清你当前阶段更值得投入的方向' },
  { title: '方向建议', desc: '给出更容易执行的行动参考与节奏提醒' },
  { title: '今日启示', desc: '一句有仪式感但不夸张的灵感提示' },
]

export default function HomePage() {
  const [userInfo, setUserInfo] = useState<any>(null)

  useLoad(() => {
    // 检查登录状态
    checkLoginStatus()
  })

  const checkLoginStatus = () => {
    const token = Taro.getStorageSync('token')
    const user = Taro.getStorageSync('userInfo')
    
    // @ts-ignore
    if (process.env.TARO_ENV === 'weapp') {
      // 微信小程序环境，token存在即可
      if (!token) {
        // 未登录，跳转到登录页
        Taro.redirectTo({ url: '/pages/login/index' })
        return
      }
    } else {
      // H5/PC环境，检查token
      if (!token) {
        // 未登录，跳转到登录页
        Taro.redirectTo({ url: '/pages/login/index' })
        return
      }
    }
    
    if (user) {
      setUserInfo(user)
    }
  }

  const goNext = () => {
    Taro.navigateTo({ url: '/pages/form/index' })
  }

  return (
    <View className='page-shell home-page'>
      <View className='page-glow page-glow--one' />
      <View className='page-glow page-glow--two' />
      <View className='container'>
        <View className='card hero-card'>
          <View className='seal-wrap'>
            <View className='seal-outer'>
              <View className='seal-inner'>运</View>
            </View>
          </View>

          <View className='brand-title'>未来超级展望师</View>
          <View className='brand-subtitle'>以东方灵感，解读你的趋势与方向</View>

          <View className='tag-row'>
            <View className='tag-item'>东方灵感</View>
            <View className='tag-item'>未来趋势</View>
            <View className='tag-item'>专属建议</View>
          </View>

          <View className='preview-card'>
            <View className='preview-label'>今日关键词</View>
            <View className='preview-keyword'>藏锋待时</View>
            <View className='preview-text'>当前阶段更适合稳中求进，先收拢注意力，再做关键决定。</View>
            <View className='preview-tip'>建议：先完成最重要的一件事，不要同时分散到太多方向。</View>
          </View>

          <Button className='primary-btn home-start-btn' onClick={goNext}>立即开启展望</Button>
          <View className='start-tip muted'>约 30 秒，生成专属趋势参考</View>
        </View>

        <View className='section-title'>你将获得</View>
        {benefits.map((item) => (
          <View key={item.title} className='card benefit-card'>
            <View className='benefit-badge'>{item.title.slice(0, 1)}</View>
            <View className='benefit-body'>
              <View className='benefit-title'>{item.title}</View>
              <Text className='benefit-desc'>{item.desc}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  )
}
