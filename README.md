# 未来超级展望师 · Taro 第一版

这是一个真正按 **Taro + React + TypeScript + SCSS** 写的三页项目骨架：

- 首页 `pages/home/index`
- 填写页 `pages/form/index`
- 结果页 `pages/result/index`

## 环境建议

- Node.js 18 或 20
- npm 9+

## 安装

```bash
npm install
```

## 运行 H5

```bash
npm run dev:h5
```

浏览器直接打开：

```text
http://localhost:10086/
```

> H5 路由已配置为 `hash`，直接访问根地址最稳。

## 运行微信小程序

```bash
npm run dev:weapp
```

然后用微信开发者工具打开项目目录。

## 小程序 AppID

在 `project.config.json` 中把：

```json
"appid": "touristappid"
```

改成你自己的 AppID。

## 项目说明

这版故意不使用 Tailwind、不使用 `lucide-react`，只保留 Taro 官方依赖与基础 React 依赖，优先保证：

1. H5 能启动
2. 微信小程序能编译
3. 三页链路能跑通

## 页面链路

首页 -> 填写页 -> 结果页

填写后会把表单和 mock 结果写入本地 storage，再在结果页读取展示。
