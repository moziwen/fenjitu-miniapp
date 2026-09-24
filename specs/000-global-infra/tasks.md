# 000-global-infra 全局基建

> 项目第一周任务。基建没过验收，page-restorer 不上岗——全局坑每页踩一遍是上一轮最大提速损失。

## 任务

- [ ] 工程骨架：uni-app 3 + Vue 3 + TS + Vite；manifest `transformPx:false`；appid 空（开发者工具游客模式）
- [ ] pages.json：按逆向仓 `app-config.json` 逐页落导航栏配置；**仅 index/daka 为 custom**
- [ ] ColorUI 引入：`src/styles/colorui.css`（rpx→px、page 兜底）+ animation.css，App.vue @import；验收=app.wxss≈140KB
- [ ] 数据管线：`src/data/` + `import.meta.glob`（eager/lazy 不重叠）；验收=构建后包内无运行时读文件
- [ ] api 层：统一包络解包 `{code,msg,data,request_id}`、错误码枚举、request_id 透传
- [ ] store 骨架：函数名=云函数名
- [ ] ETL：reverse 仓 captures jsonl → src/data/*.json 脚本
- [ ] tabbar：图标按逆向仓资源清单落（剔除多余组）

## 验收

用最简单一页（set）跑通「spec → 写页 → gate 全绿」全流程，产出基建验收报告，停下等用户验收。
