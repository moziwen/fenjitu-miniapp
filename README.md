# fenjitu-miniapp

「英语分级兔」前端还原仓：uni-app 3 + Vue 3 + TypeScript，编译目标 `mp-weixin`，1:1 还原。
**唯一输入** = reverse-fenjitu 仓的 specs（页面规格 + 接口契约）。后端见 fenjitu-backend（pi 承接）。

## 快速开始（agent）

1. 读 [AGENTS.md](AGENTS.md)：强制规范 + 铁律 9 条 + 质量门禁
2. 读 `agents/` 对应岗位：infra-builder / page-restorer / build-gate
3. 读 `PROGRESS.md` 确认进度。**一页一停，做完即停等验收**

## 目录

```
specs/000-global-infra/  全局基建任务（第一周，基建不过不写业务页）
specs/pages/NNN-<页名>/  每页 SDD：ui-spec(引自逆向仓)/logic-spec/acceptance/tasks
src/                     uni-app 源码（pages/api/store/data/styles）
scripts/                 ETL 与工具脚本
agents/                  subagent 岗位说明
skills/                  作业技能（miniapp-ui-restore SOP + 项目铁律）
```

## 页面全流程

```
逆向仓 spec(对账通过) → 建本仓 specs/pages/NNN-<页名>/ → page-restorer 写页
→ build-gate 门禁 → PROGRESS.md 更新 → 停下等用户验收（视觉终审）
```

## 构建

```bash
npm run build:mp-weixin   # 9~17 分钟，必须后台跑
# 产物 dist/build/mp-weixin，用微信开发者工具打开（appid 空，游客模式）
```
