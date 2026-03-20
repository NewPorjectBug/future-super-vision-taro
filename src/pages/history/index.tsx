import React, { useEffect, useState } from 'react'
import { View, Text } from '@tarojs/components'
import { apiRequest } from '../../services/api'
import './index.scss'

const HistoryPage: React.FC = () => {
  const [history, setHistory] = useState<Array<{date: string, keyword: string, summary: string}>>([])

  useEffect(() => {
    const load = async () => {
      try {
        const res = await apiRequest('/history', { method: 'GET' })
        if (Array.isArray(res)) {
          setHistory(res)
        }
      } catch (error) {
        console.error('获取历史失败', error)
      }
    }
    load()
  }, [])

  const list = history.length ? history : [
    { date: '2026-03-18', keyword: '藏锋待时', summary: '当前阶段适合稳中求进，优先处理真正重要的事。' },
    { date: '2026-03-15', keyword: '蓄势而发', summary: '更适合积蓄与校准，而不是盲目冲刺。' },
    { date: '2026-03-10', keyword: '循势而行', summary: '这段时间更适合顺势调整节奏，减少无效消耗。' }
  ]

  return (
    <View className='simple-page'>
      <View className='simple-title'>历史记录</View>
      {list.map(item => (
        <View className='simple-card' key={item.date + item.keyword}>
          <Text className='simple-date'>{item.date}</Text>
          <Text className='simple-keyword'>{item.keyword}</Text>
          <Text className='simple-summary'>{item.summary}</Text>
        </View>
      ))}
    </View>
  )
}

export default HistoryPage
