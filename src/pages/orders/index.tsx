import React, { useEffect, useState } from 'react'
import { View, Text } from '@tarojs/components'
import { apiRequest } from '../../services/api'
import './index.scss'

const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Array<{id: string, title: string, price: string, status: string}>>([])

  useEffect(() => {
    const load = async () => {
      try {
        const res = await apiRequest('/orders', { method: 'GET' })
        if (Array.isArray(res)) {
          setOrders(res)
        }
      } catch (error) {
        console.error('获取订单失败', error)
      }
    }
    load()
  }, [])

  const list = orders.length ? orders : [
    { id: 'FSV20260318001', title: '7天行动建议包', price: '¥29.9', status: '已完成' },
    { id: 'FSV20260312008', title: '事业专项深度报告', price: '¥19.9', status: '已完成' },
    { id: 'FSV20260301002', title: '基础深度报告', price: '¥9.9', status: '已完成' }
  ]

  return (
    <View className='order-page'>
      <View className='order-title'>我的订单</View>
      {list.map(item => (
        <View className='order-card' key={item.id}>
          <Text className='order-id'>订单号：{item.id}</Text>
          <Text className='order-name'>{item.title}</Text>
          <View className='order-footer'>
            <Text className='order-price'>{item.price}</Text>
            <Text className='order-status'>{item.status}</Text>
          </View>
        </View>
      ))}
    </View>
  )
}

export default OrdersPage
