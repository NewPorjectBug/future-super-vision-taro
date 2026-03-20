import { Button, Text, View } from '@tarojs/components'
import Taro, { useDidShow } from '@tarojs/taro'
import { useState } from 'react'
import type { FormData, ResultData } from '../../types'
import './index.scss'

const fallbackResult: ResultData = {
  keyword: '藏锋待时',
  title: '专属趋势参考',
  summary: '当前阶段适合稳中求进，优先处理真正重要的事。',
  tags: ['稳中求进', '聚焦核心'],
  trendText: '建议先解决最关键的问题，本周以稳定为主。',
  suggestions: ['优先处理最重要的一件事', '避免分散精力', '适度复盘本周计划']
}

export default function ResultPage() {
  const [result, setResult] = useState<ResultData>(fallbackResult)
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
