import { Button, Input, Picker, Text, View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useMemo, useState } from 'react'
import { buildMockResult } from '../../services/mock'
import type { FormData } from '../../types'
import './index.scss'

const focusOptions = [
  { value: 'career', label: '事业成长' },
  { value: 'emotion', label: '情感关系' },
  { value: 'plan', label: '近期规划' },
  { value: 'daily', label: '今日启示' },
] as const

export default function FormPage() {
  const [nickname, setNickname] = useState('')
  const [birthDate, setBirthDate] = useState('')
  const [gender, setGender] = useState<FormData['gender']>('secret')
  const [focus, setFocus] = useState<FormData['focus']>('career')

  const focusLabel = useMemo(() => focusOptions.find((item) => item.value === focus)?.label ?? '事业成长', [focus])

  const submit = () => {
    if (!nickname.trim()) {
      Taro.showToast({ title: '请先填写昵称', icon: 'none' })
      return
    }
    if (!birthDate) {
      Taro.showToast({ title: '请选择出生日期', icon: 'none' })
      return
    }

    const payload: FormData = {
      nickname: nickname.trim(),
      birthDate,
      gender,
      focus,
    }
    Taro.setStorageSync('fsv_form', payload)
    Taro.setStorageSync('fsv_result', buildMockResult(payload))
    Taro.navigateTo({ url: '/pages/result/index' })
  }

  return (
    <View className='page-shell form-page'>
      <View className='page-glow page-glow--one' />
      <View className='page-glow page-glow--two' />
      <View className='container'>
        <View className='card header-card'>
          <View className='header-row'>
            <View>
              <View className='header-small'>开始生成你的专属结果</View>
              <View className='header-title'>填写基础信息</View>
            </View>
            <View className='header-chip'>约 30 秒</View>
          </View>
          <Text className='header-desc'>只需填写几项基础信息，我们会为你生成更贴近当前状态的趋势参考与行动建议。</Text>
        </View>

        <View className='card field-card'>
          <View className='field-label'>昵称</View>
          <Input
            className='field-input'
            value={nickname}
            maxlength={12}
            placeholder='请输入你的称呼'
            placeholderClass='field-placeholder'
            onInput={(e) => setNickname(e.detail.value)}
          />
        </View>

        <View className='card field-card'>
          <View className='field-label'>出生日期</View>
          <Picker mode='date' value={birthDate} onChange={(e) => setBirthDate(e.detail.value)}>
            <View className='picker-box'>
              <Text className={birthDate ? 'picker-value' : 'picker-placeholder'}>
                {birthDate || '请选择出生日期'}
              </Text>
              <Text className='picker-arrow'>▼</Text>
            </View>
          </Picker>
        </View>

        <View className='card field-card'>
          <View className='field-label'>性别（可选）</View>
          <View className='gender-row'>
            <View className={gender === 'male' ? 'gender-item gender-item--active' : 'gender-item'} onClick={() => setGender('male')}>男</View>
            <View className={gender === 'female' ? 'gender-item gender-item--active' : 'gender-item'} onClick={() => setGender('female')}>女</View>
            <View className={gender === 'secret' ? 'gender-item gender-item--active' : 'gender-item'} onClick={() => setGender('secret')}>保密</View>
          </View>
        </View>

        <View className='card field-card'>
          <View className='field-label'>你当前最关注什么</View>
          <View className='focus-row'>
            {focusOptions.map((item) => (
              <View
                key={item.value}
                className={focus === item.value ? 'focus-item focus-item--active' : 'focus-item'}
                onClick={() => setFocus(item.value)}
              >
                {item.label}
              </View>
            ))}
          </View>
        </View>

        <View className='card privacy-card'>
          <Text className='privacy-text'>你的信息仅用于生成当前结果展示，不会在页面中直接公开展示。当前关注：{focusLabel}</Text>
        </View>

        <Button className='primary-btn form-submit-btn' onClick={submit}>生成我的专属展望</Button>
        <View className='form-footer muted'>字段尽量少，保证填写页完成率</View>
      </View>
    </View>
  )
}
