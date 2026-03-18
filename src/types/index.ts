export interface FormData {
  nickname: string
  birthDate: string
  gender: 'male' | 'female' | 'secret'
  focus: 'career' | 'emotion' | 'plan' | 'daily'
}

export interface ResultData {
  keyword: string
  title: string
  summary: string
  tags: string[]
  trendText: string
  suggestions: string[]
}
