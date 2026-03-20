require('dotenv').config()

const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const compression = require('compression')
const sqlite3 = require('sqlite3').verbose()
const { open } = require('sqlite')
const { v4: uuidv4 } = require('uuid')
const OpenAI = require('openai')

const app = express()

let db

async function initDb() {
  db = await open({
    filename: process.env.SQLITE_FILE || './database.sqlite',
    driver: sqlite3.Database,
  })

  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      phone TEXT UNIQUE,
      nickname TEXT,
      memberLabel TEXT,
      token TEXT
    );
  `)

  await db.exec(`
    CREATE TABLE IF NOT EXISTS history (
      id TEXT PRIMARY KEY,
      date TEXT,
      keyword TEXT,
      summary TEXT
    );
  `)

  await db.exec(`
    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      title TEXT,
      price TEXT,
      status TEXT
    );
  `)

  // 插入默认数据（无重复）
  await db.run(`INSERT OR IGNORE INTO history (id,date,keyword,summary) VALUES
    ('h1','2026-03-18','藏锋待时','当前阶段适合稳中求进，优先处理真正重要的事。'),
    ('h2','2026-03-15','蓄势而发','更适合积蓄与校准，而不是盲目冲刺。'),
    ('h3','2026-03-10','循势而行','这段时间更适合顺势调整节奏，减少无效消耗。')
  `)

  await db.run(`INSERT OR IGNORE INTO orders (id,title,price,status) VALUES
    ('FSV20260318001','7天行动建议包','¥29.9','已完成'),
    ('FSV20260312008','事业专项深度报告','¥19.9','已完成'),
    ('FSV20260301002','基础深度报告','¥9.9','已完成')
  `)
}

app.use(helmet())
app.use(cors({
  origin: process.env.FRONTEND_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))
app.use(compression())
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'))
app.use(express.json())

const PORT = process.env.PORT || 3000

app.get('/api/auth/sms/send', (req, res) => {
  const { phone } = req.query
  if (!phone || !/^1\d{10}$/.test(phone)) {
    return res.status(400).json({ code: 400, message: '手机号不正确' })
  }
  // 模拟发送成功，实际应调用短信服务
  res.json({ code: 200, data: { success: true, message: '验证码发送成功: 1234 (仅示例)' } })
})

app.post('/api/auth/sms/login', async (req, res) => {
  const { phone, code } = req.body

  if (!phone || !/^1\d{10}$/.test(phone)) {
    return res.status(400).json({ code: 400, message: '手机号不正确' })
  }
  if (!code || code.toString().trim().length < 4) {
    return res.status(400).json({ code: 400, message: '验证码不正确' })
  }

  try {
    let user = await db.get('SELECT * FROM users WHERE phone = ?', phone)

    if (!user) {
      const id = uuidv4()
      const token = uuidv4()
      await db.run('INSERT INTO users (id, phone, nickname, memberLabel, token) VALUES (?, ?, ?, ?, ?)', id, phone, '新用户', '普通用户', token)
      user = { id, phone, nickname: '新用户', memberLabel: '普通用户', token }
    } else {
      const token = uuidv4()
      user.token = token
      await db.run('UPDATE users SET token = ? WHERE phone = ?', token, phone)
    }

    res.json({ code: 200, data: { token: user.token, userInfo: { nickname: user.nickname, memberLabel: user.memberLabel } } })
  } catch (error) {
    console.error('login error', error)
    res.status(500).json({ code: 500, message: '登录失败' })
  }
})

app.get('/api/user', async (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '') || req.query.token
  if (!token) {
    return res.status(401).json({ code: 401, message: '未授权' })
  }

  try {
    const user = await db.get('SELECT * FROM users WHERE token = ?', token)
    if (!user) {
      return res.status(401).json({ code: 401, message: 'token无效' })
    }
    res.json({ code: 200, data: { nickname: user.nickname, memberLabel: user.memberLabel } })
  } catch (error) {
    console.error('user lookup error', error)
    res.status(500).json({ code: 500, message: '获取用户失败' })
  }
})

app.get('/api/history', async (req, res) => {
  try {
    const list = await db.all('SELECT date, keyword, summary FROM history ORDER BY date DESC')
    res.json({ code: 200, data: list })
  } catch (error) {
    console.error('history error', error)
    res.status(500).json({ code: 500, message: '获取历史失败' })
  }
})

app.get('/api/orders', async (req, res) => {
  try {
    const list = await db.all('SELECT id, title, price, status FROM orders ORDER BY id DESC')
    res.json({ code: 200, data: list })
  } catch (error) {
    console.error('orders error', error)
    res.status(500).json({ code: 500, message: '获取订单失败' })
  }
})

app.post('/api/fortune', async (req, res) => {
  const { nickname, birthDate, gender, focus } = req.body || {}

  if (!nickname || !birthDate || !focus) {
    return res.status(400).json({ code: 400, message: '参数不完整' })
  }

  const kimiKey = process.env.KIMI_API_KEY || 'YOUR_KIMI_API_KEY'
  const kimiUrl = process.env.KIMI_API_URL || 'https://api.moonshot.cn/v1'

  const openai = new OpenAI({
    apiKey: kimiKey,
    baseURL: kimiUrl,
  })

  const prompt = `你是一个专业的算命师，系统模型 Kimi2.5。根据以下用户信息给出趋势分析、关键建议、今日启示，要求中文输出，温和积极。
昵称：${nickname}
出生日期：${birthDate}
性别：${gender || '保密'}
关注：${focus}

请直接输出 JSON，关键字段：keyword, title, summary, tags(数组), trendText, suggestions(数组)。例如：
{
  "keyword":"藏锋待时",
  "title":"本日趋势",
  "summary":"...",
  "tags":["稳中求进","调整节奏"],
  "trendText":"...",
  "suggestions":["...","..."]
}`

  try {
    const completion = await openai.chat.completions.create({
      model: 'kimi-k2-turbo-preview',
      messages: [
        { role: 'system', content: '你是 Kimi，由 Moonshot AI 提供的人工智能助手，你更擅长中文和英文的对话，提供安全、准确、积极回答。' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.6,
      max_tokens: 800
    })

    const generated = completion.choices?.[0]?.message?.content || ''

    let parsed = null
    if (generated) {
      try {
        parsed = JSON.parse(generated.trim())
      } catch (e) {
        const jsonMatch = generated.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
          try {
            parsed = JSON.parse(jsonMatch[0])
          } catch (err) {
            parsed = null
          }
        }
      }
    }

    if (!parsed || !parsed.keyword) {
      parsed = {
        keyword: '藏锋待时',
        title: '专属趋势参考',
        summary: '当前阶段适合稳中求进，优先处理真正重要的事。',
        tags: ['稳中求进', '聚焦核心'],
        trendText: '建议先解决最关键的问题，本周以稳定为主。',
        suggestions: ['优先处理最重要的一件事', '避免分散精力', '适度复盘本周计划']
      }
    }

    res.json({ code: 200, data: parsed })
  } catch (error) {
    console.error('fortune error', error)
    res.status(500).json({ code: 500, message: 'Kimi2.5算命服务异常' })
  }
})

app.get('/api/health', (req, res) => {
  res.json({ code: 200, status: 'ok', nodeEnv: process.env.NODE_ENV || 'development' })
})

app.use((req, res) => {
  res.status(404).json({ code: 404, message: 'Not Found' })
})

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err)
  res.status(500).json({ code: 500, message: 'Internal Server Error' })
})

initDb().then(() => {
  app.listen(PORT, () => {
    console.log(`后端服务已启动: http://localhost:${PORT}`)
  })
}).catch((error) => {
  console.error('初始化数据库失败', error)
  process.exit(1)
})
