import React, { useEffect, useMemo, useState } from 'react'
import Taro from '@tarojs/taro'
import { View, Text, Input, Button } from '@tarojs/components'
import { apiRequest } from '../../services/api'
import './index.scss'

const PhoneLoginPage: React.FC = () => {
  const [phone, setPhone] = useState('')
  const [code, setCode] = useState('')
  const [countdown, setCountdown] = useState(0)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (countdown <= 0) return
    const timer = setTimeout(() => setCountdown(prev => prev - 1), 1000)
    return () => clearTimeout(timer)
  }, [countdown])

  const phoneValid = useMemo(() => /^1\d{10}$/.test(phone), [phone])
  const canSubmit = useMemo(() => phoneValid && code.trim().length >= 4, [phoneValid, code])

  const handleSendCode = async () => {
    if (!phoneValid) {
      Taro.showToast({ title: '请输入正确手机号', icon: 'none' })
      return
    }

    if (countdown > 0) return

    try {
      setLoading(true)
      const res = await apiRequest('/auth/sms/send', {
        method: 'GET',
        data: { phone }
      })

      if (res && res.success) {
        Taro.showToast({ title: '验证码已发送，示例1234', icon: 'success' })
        setCountdown(60)
      } else {
        Taro.showToast({ title: res?.message || '发送失败', icon: 'none' })
      }
    } catch (error) {
      Taro.showToast({ title: '发送验证码失败，请重试', icon: 'none' })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async () => {
    if (!canSubmit) {
      Taro.showToast({ title: '请完善手机号和验证码', icon: 'none' })
      return
    }

    try {
      setLoading(true)
      Taro.showLoading({ title: '登录中...' })

      const res = await apiRequest('/auth/sms/login', {
        method: 'POST',
        data: { phone, code }
      })

      if (!res || !res.token) {
        throw new Error('登录失败')
      }

      Taro.setStorageSync('token', res.token)
      Taro.setStorageSync('userInfo', {
        nickname: res.userInfo?.nickname || '用户',
        memberLabel: res.userInfo?.memberLabel || '普通用户'
      })

      Taro.showToast({ title: '登录成功', icon: 'success' })
      setTimeout(() => {
        Taro.redirectTo({ url: '/pages/mine/index' })
      }, 500)
    } catch (error) {
      Taro.showToast({ title: (error as any)?.message || '登录失败', icon: 'none' })
    } finally {
      setLoading(false)
      Taro.hideLoading()
    }
  }

  return (
    <View className='phone-login-page'>
      <View className='phone-card'>
        <View className='phone-title'>手机号验证码登录</View>
        <View className='phone-desc'>
          适用于浏览器 H5 或作为小程序 / 微信内 H5 的补充登录方式
        </View>

        <View className='field-block'>
          <Text className='field-label'>手机号</Text>
          <Input
            className='field-input'
            type='number'
            maxlength={11}
            placeholder='请输入手机号'
            value={phone}
            onInput={e => setPhone((e.detail.value || '').trim())}
          />
        </View>

        <View className='field-block'>
          <Text className='field-label'>验证码</Text>
          <View className='code-row'>
            <Input
              className='field-input code-input'
              type='number'
              maxlength={6}
              placeholder='请输入验证码'
              value={code}
              onInput={e => setCode((e.detail.value || '').trim())}
            />
            <Button className='code-btn' disabled={!phoneValid || countdown > 0 || loading} onClick={handleSendCode}>
              {countdown > 0 ? `${countdown}s` : '获取验证码'}
            </Button>
          </View>
        </View>

        <Button className='submit-btn' onClick={handleSubmit} disabled={!canSubmit || loading}>
          确认登录
        </Button>

        <View className='hint-text'>
          当前为可运行前端示例页，短信发送与登录提交已连接本地后端。
        </View>
      </View>
    </View>
  )
}

export default PhoneLoginPage
