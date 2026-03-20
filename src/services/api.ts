import Taro from '@tarojs/taro'

// API 基础配置
// 统一在这里管理：开发/测试/生产环境地址
export type ApiEnv = 'development' | 'test' | 'production'

const rawEnv = (
  process.env.API_ENV ||
  (process.env as any).VITE_API_ENV ||
  process.env.NODE_ENV ||
  'development'
).toString().toLowerCase()

export const API_ENV: ApiEnv =
  rawEnv === 'production'
    ? 'production'
    : rawEnv === 'test'
      ? 'test'
      : 'development'

const API_BASE_URLS: Record<ApiEnv, string> = {
  development: 'http://localhost:3000',
  test: 'http://106.15.230.201:3000',
  production: 'https://your-domain.com',
}

export const API_BASE_URL = API_BASE_URLS[API_ENV]
export const API_PREFIX = '/api'

export function buildApiUrl(path: string): string {
  const normalized = path.startsWith('/') ? path : `/${path}`
  return `${API_BASE_URL}${API_PREFIX}${normalized}`
}

// @ts-ignore: Taro 类型注入时可测试，改造简单统一调用
export async function apiRequest<T = any>(
  path: string,
  options: {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
    data?: any
    header?: Record<string, any>
    timeout?: number
  } = {}
): Promise<T> {
  const defaultMethod = 'GET'
  const method = (options.method || defaultMethod).toUpperCase() as
    | 'GET'
    | 'POST'
    | 'PUT'
    | 'DELETE'
    | 'PATCH'

  const requestConfig: any = {
    url: buildApiUrl(path),
    method,
    data: options.data || {},
    header: {
      'content-type': 'application/json',
      ...options.header,
    },
    timeout: options.timeout || 15000,
  }

  const res = await (Taro as any).request(requestConfig)

  if (!res || typeof res !== 'object') {
    throw new Error('无效的网络响应')
  }

  if (res.statusCode && (res.statusCode < 200 || res.statusCode >= 300)) {
    throw new Error(`HTTP ${res.statusCode}`)
  }

  // 兼容后端标准：{code,data,message}
  if (res.data && res.data.code && res.data.code !== 200) {
    throw new Error(res.data.message || '请求失败')
  }

  return res.data?.data ?? res.data
}

