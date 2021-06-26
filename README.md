# kaiheila.ts
> 一个使用 typescript 编写的开黑啦机器人框架

## 开发进度
- [x] ~~服务器相关接口~~
- [x] ~~频道相关接口~~
- [x] ~~频道消息相关接口~~
- [x] ~~私聊会话接口~~
- [x] ~~Gateway相关接口~~
- [x] ~~私聊消息相关接口~~
- [x] ~~用户相关接口~~
- [x] ~~媒体模块接口~~
- [x] ~~服务器角色相关接口~~
- [ ] 亲密度相关接口
- [ ] 服务器表情相关接口
- [ ] 邀请相关接口
- [x] ~~卡片消息生成器~~
- [x] ~~插件模块~~
- [x] ~~频道相关事件~~
- [x] ~~私聊消息事件~~
- [x] ~~服务器成员相关事件~~
- [x] ~~服务器角色相关事件~~
- [x] ~~服务器相关事件~~
- [x] ~~消息相关事件~~
- [x] ~~用户相关事件~~

## 配置文件
```json
{
  "bot": {
    "token": "机器人的token"
  },
  "logger": {
    "level": "日志级别"
  },
  "plugins": {
    // 你要引用的插件的文件名或者npm包的名字
    "./test.ts": {
      // 传递给插件的配置
    }
  }
}
```

## 插件开发
参考以下代码
```typescript
import { ctx } from "./lib/plugin"; // 引入这个是为了代码提示

export default (ctx: ctx) => {
  ctx.logger.info(ctx.config) // 插件的配置文件在这里可以找到

  ctx.logger.info('xxx') // 这个是日志模块

  // 注册一个命令
  ctx.command(/^\/help$/, '/help', '查看帮助信息', (match, event, reply) => {
    // 命令被触发做的事情
    reply(1, 'xxx') // 快速回复
  })

  ctx.bot // Bot实例在这里
}
```

## BUG反馈
- 直接提交 issue
- [开黑啦](https://kaihei.co/61zvJF)