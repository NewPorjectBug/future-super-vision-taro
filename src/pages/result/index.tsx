import { Button, Text, View } from '@tarojs/components'
import Taro, { useDidShow } from '@tarojs/taro'
import { useState } from 'react'
import { buildMockResult } from '../../services/mock'
import type { FormData, ResultData } from '../../types'
import './index.scss'

const fallbackForm: FormData = {
  nickname: '你',
  birthDate: '1998-01-01',
  gender: 'secret',
  focus: 'career',
}

export default function ResultPage() {
  const [result, setResult] = useState<ResultData>(() => buildMockResult(fallbackForm))
  const [nickname, setNickname] = useState('你')

  useDidShow(() => {
    const savedForm = Taro.getStorageSync('fsv_form') as FormData | undefined
    const savedResult = Taro.getStorageSync('fsv_result') as ResultData | undefined
    if (savedForm?.nickname) {
      setNickname(savedForm.nickname)
    }
    if (savedResult?.keyword) {
      setResult(savedResult)
    }
  })

  const goBack = () => Taro.navigateBack({ delta: 1 })
  const goHome = () => Taro.reLaunch({ url: '/pages/home/index' })

  return (
    <View className='page-shell result-page'>
      <View className='page-glow page-glow--one' />
      <View className='page-glow page-glow--two' />
      <View className='container'>
        <View className='card result-top-card'>
          <View className='result-small'>{nickname} 的专属展望结果</View>
          <View className='result-title'>{result.title}</View>

          <View className='keyword-card'>
            <View className='keyword-label'>核心关键词</View>
            <View className='keyword-text'>{result.keyword}</View>
            <View className='tag-row'>
              {result.tags.map((tag) => (
                <View key={tag} className='result-tag'>{tag}</View>
              ))}
            </View>
            <Text className='summary-text'>{result.summary}</Text>
          </View>
        </View>

        <View className='section-title'>趋势解读</View>
        <View className='card result-block'>
          <Text className='result-paragraph'>{result.trendText}</Text>
        </View>

        <View className='section-title'>行动建议</View>
        {result.suggestions.map((item, index) => (
          <View key={item} className='card suggestion-card'>
            <View className='suggestion-index'>{index + 1}</View>
            <Text className='suggestion-text'>{item}</Text>
          </View>
        ))}

        <View className='result-actions'>
          <Button className='secondary-btn action-btn' onClick={goBack}>再测一次</Button>
          <Button className='primary-btn action-btn' onClick={goHome}>返回首页</Button>
        </View>
      </View>
    </View>
  )
}
