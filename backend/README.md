# 后端服务（Future Super Vision）

## 目录结构

- `index.js` - 业务逻辑入口
- `package.json` - 依赖与脚本
- `.env` - 环境变量（请勿提交到 git）

## 环境依赖

- Node.js >= 18

## 安装与启动

```
cd backend
npm install
cp .env.example .env
# 编辑 .env 填写 KIMI_API_KEY
npm start
```

开发模式：
```
npm run dev
```

## 关键环境变量

- `PORT` - 服务端口
- `KIMI_API_URL` - Kimi 2.5 调用地址
- `KIMI_API_KEY` - Kimi API Key
- `FRONTEND_ORIGIN` - 前端地址（允许跨域）
- `NODE_ENV` - `development` / `production`

## API 列表

- `GET /api/health`
- `GET /api/auth/sms/send?phone=xxx`
- `POST /api/auth/sms/login`
- `GET /api/user` (Token 校验)
- `GET /api/history` (登录可选)
- `GET /api/orders` (登录可选)
- `POST /api/fortune` (调用 Kimi2.5)

## 发布到服务器（Docker）

你可以使用 Docker 快速部署：

```Dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --production
COPY . .
CMD ["npm", "start"]
``` 

并在产品网关/负载均衡中配置 `PORT` 和 `KIMI_API_KEY` 环境变量。
