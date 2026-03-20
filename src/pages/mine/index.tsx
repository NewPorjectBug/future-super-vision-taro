import React, { useEffect, useState } from 'react'
import Taro from '@tarojs/taro'
import { View, Text, Button, Switch } from '@tarojs/components'
import './index.scss'

const MinePage: React.FC = () => {
  const [subscribeEnabled, setSubscribeEnabled] = useState(true)

  useEffect(() => {
    const token = Taro.getStorageSync('token')
    if (!token) {
      Taro.redirectTo({ url: '/pages/login/index' })
    }
  }, [])

  const user = {
    nickname: '清风',
    memberLabel: '普通用户',
    resultCount: 18,
    orderCount: 3,
    purchasedCount: 5
  }

  const menuList = [
    {
      title: '历史记录',
      desc: '查看你过去的趋势结果',
      url: '/pages/history/index'
    },
    {
      title: '我的订单',
      desc: '查看已购报告与支付记录',
      url: '/pages/orders/index'
    },
    {
      title: '已购内容',
      desc: '回看你解锁过的深度内容',
      url: '/pages/orders/index'
    }
  ]

  const handleOpen = (url: string) => {
    Taro.navigateTo({ url })
  }

  const handleLogout = () => {
    Taro.showModal({
      title: '退出登录',
      content: '确认退出当前账号吗？',
      success: (res) => {
        if (res.confirm) {
          Taro.showToast({ title: '已退出（示例）', icon: 'none' })
          setTimeout(() => {
            Taro.redirectTo({ url: '/pages/login/index' })
          }, 500)
        }
      }
    })
  }

  return (
    <View className='mine-page'>
      <View className='mine-bg-glow glow-1' />
      <View className='mine-bg-glow glow-2' />

      <View className='mine-card profile-card'>
        <View className='avatar-circle'>玄</View>
        <View className='profile-info'>
          <View className='nickname-row'>
            <Text className='nickname'>{user.nickname}</Text>
            <Text className='member-tag'>{user.memberLabel}</Text>
          </View>
          <View className='profile-desc'>
            已登录，可保存历史结果、已购内容与后续提醒
          </View>
        </View>
      </View>

      <View className='mine-card stats-card'>
        <View className='stat-item'>
          <Text className='stat-num'>{user.resultCount}</Text>
          <Text className='stat-label'>历史结果</Text>
        </View>
        <View className='stat-item'>
          <Text className='stat-num'>{user.orderCount}</Text>
          <Text className='stat-label'>订单数量</Text>
        </View>
        <View className='stat-item'>
          <Text className='stat-num'>{user.purchasedCount}</Text>
          <Text className='stat-label'>已购内容</Text>
        </View>
      </View>

      <View className='mine-card'>
        <View className='section-title'>我的内容</View>
        {menuList.map(item => (
          <View key={item.title} className='menu-item' onClick={() => handleOpen(item.url)}>
            <View className='menu-left'>
              <Text className='menu-title'>{item.title}</Text>
              <Text className='menu-desc'>{item.desc}</Text>
            </View>
            <Text className='menu-arrow'>{'>'}</Text>
          </View>
        ))}
      </View>

      <View className='mine-card'>
        <View className='section-title'>账号与提醒</View>
        <View className='switch-row'>
          <View className='switch-texts'>
            <Text className='switch-title'>订阅趋势提醒</Text>
            <Text className='switch-desc'>用于接收后续每日 / 每周提醒</Text>
          </View>
          <Switch
            checked={subscribeEnabled}
            color='#d8b06a'
            onChange={e => setSubscribeEnabled(!!e.detail.value)}
          />
        </View>

        <View className='menu-item' onClick={() => Taro.showToast({ title: '这里可接账号设置页', icon: 'none' })}>
          <View className='menu-left'>
            <Text className='menu-title'>账号设置</Text>
            <Text className='menu-desc'>修改昵称、绑定手机号、账号安全</Text>
          </View>
          <Text className='menu-arrow'>{'>'}</Text>
        </View>

        <View className='menu-item no-border' onClick={() => Taro.showToast({ title: '这里可接联系客服', icon: 'none' })}>
          <View className='menu-left'>
            <Text className='menu-title'>联系客服</Text>
            <Text className='menu-desc'>订单、登录、权益相关问题处理</Text>
          </View>
          <Text className='menu-arrow'>{'>'}</Text>
        </View>
      </View>

      <Button className='logout-btn' onClick={handleLogout}>
        退出登录
      </Button>
    </View>
  )
}

export default MinePage
