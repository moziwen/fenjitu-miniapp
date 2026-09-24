# 验收规格（acceptance.md）

> 每页一份。静态项 agent 自检，视觉项用户终审（agent 无法替代微信开发者工具目测）。

## 静态验收（build-gate 执行）

| # | 检查项 | 命令/方法 | 期望 |
|---|---|---|---|
| 1 | typecheck | `npm run typecheck` | exit 0 |
| 2 | 编译 | `npm run build:mp-weixin`（后台） | exit 0 |
| 3 | 产物四件套 | `ls dist/build/mp-weixin/pages/<p>/` | js/wxml/wxss/json 齐 |
| 4 | 分享钩子 | `grep onShareAppMessage <p>.js` | 命中（有分享的页） |
| 5 | 无自绘 header | `grep -c 'class="header"' <p>.wxml` | 0（非 custom 页） |
| 6 | 关键类抽查 | `grep -o "<spec第2节的3个代表类>" <p>.wxml` | 全命中 |
| 7 | app.wxss 体积 | `wc -c dist/build/mp-weixin/app.wxss` | ≈140KB |
| 8 | 主包体积 | `tar czf - -C dist/build mp-weixin \| wc -c` | < 2MB |

## 视觉对账（用户终审，逐项列）

- [ ] 骨架布局与原版一致（对照逆向仓 spec 第 1 节）
- [ ] 尺寸/颜色抽查 5 处
- [ ] 弹窗/分支状态逐个过（spec 第 5 节）
- [ ] 音频可播放（CDN 可达性，agent 测不了）
- [ ] 分享卡片

## 已知待裁决项

- （如：原版 off-by-one 显示 bug 是否 1:1 复刻——用户拍板后在此记录）
