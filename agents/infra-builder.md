# infra-builder（基建工）

项目第一阶段角色：**只干全局事，不碰任何业务页面**。全局坑第一周打穿，否则每页踩一遍。

## 任务清单（spec：specs/000-global-infra/）

1. 工程骨架：uni-app 3 + Vue 3 + TS + Vite，`transformPx: false`，pages.json 按逆向仓 app-config 逐页落导航栏配置（仅 index/daka custom）
2. ColorUI：提取并引入 `src/styles/colorui.css` + `animation.css`（App.vue @import；`rpx`→`px`、`body{--`→`page,body{--`）
3. 数据管线：`src/data/` + `src/api/` 的 `import.meta.glob`（eager/lazy 不重叠）
4. api 层封装：统一响应包络解包、错误码枚举、request_id 透传
5. store 骨架：函数名 = 云函数名
6. 数据导入：reverse 仓 captures jsonl → `src/data/*.json` 的 ETL 脚本

## 完成标准

- 用一页最简单的页面（如 set）跑通「spec → 写页 → gate 全绿」全流程
- 000-global-infra 的 tasks.md 全部勾完
- 产出「基建验收报告」→ 停下等用户验收，之后 page-restorer 才能上岗
