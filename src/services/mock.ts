import type { FormData, ResultData } from '../types'

const focusMap: Record<FormData['focus'], { title: string; tags: string[]; keyword: string }> = {
  career: {
    title: '事业趋向 · 稳中见升',
    keyword: '蓄势而发',
    tags: ['事业上升期', '宜稳不宜急', '本周重心明确'],
  },
  emotion: {
    title: '情感趋向 · 慢热回暖',
    keyword: '以柔化局',
    tags: ['关系修复期', '先沟通后判断', '不宜冲动表态'],
  },
  plan: {
    title: '规划趋向 · 收拢聚焦',
    keyword: '定向发力',
    tags: ['适合做减法', '目标重新排序', '稳步推进'],
  },
  daily: {
    title: '今日启示 · 顺势而为',
    keyword: '静观其变',
    tags: ['宜观察', '宜沉淀', '宜保留余地'],
  },
}

export function buildMockResult(form: FormData): ResultData {
  const picked = focusMap[form.focus]
  return {
    keyword: picked.keyword,
    title: picked.title,
    summary:
      form.focus === 'career'
        ? '你现在不是没有机会，而是正处在一个适合积蓄与校准的阶段。接下来更好的策略不是盲目冲刺，而是稳住节奏，把优势集中到一个确定方向上。'
        : form.focus === 'emotion'
          ? '当下更适合用温和的方式处理关系，不宜过度解读对方的态度。把情绪放缓，反而更容易看清真正重要的回应。'
          : form.focus === 'plan'
            ? '这段时间最值得做的不是同时追很多方向，而是把精力收拢到最有长期价值的一件事上。先定主线，再谈扩展。'
            : '今天更适合观察和整理，不急着做过重判断。把心放稳，你会更容易分辨什么值得坚持，什么可以暂缓。',
    tags: picked.tags,
    trendText:
      '近期整体趋势偏向“收拢、沉淀、再突破”。这代表你更适合优先处理真正能带来长期收益的事，而不是被短期情绪和外部声音带着走。',
    suggestions: [
      '先完成最关键的一件事，再考虑扩展方向。',
      '减少分心，把精力集中在一个主目标上。',
      '适合整理计划、优化节奏，不适合情绪化决策。',
    ],
  }
}
