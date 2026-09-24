---
name: miniapp-ui-restore
description: >-
  小程序 1:1 前端还原通用 SOP（uni-app 3 + Vue 3，编译目标 mp-weixin）。
  触发词：还原页面、1:1还原、UI对账、逐页还原、uni-app还原、小程序复刻。
  核心方法：依据包先行（脚本提取，禁凭印象写 UI）→ 全局基建前置 → 一页一停 → 静态验收脚本化 → 对账员独立 diff → 用户终审。
  项目专用版见 fenjitu-miniapp-restore；本技能是泛化版，适用于任何小程序还原项目。
---

# 小程序 1:1 UI 还原通用 SOP

## UI 漂移的三个根因（为什么常常"不是一比一"）

1. 凭印象写 UI——没先读节点树就动手
2. 生成者和检查者是同一双眼睛——盲区查不出盲区
3. 验收靠截图目测——没有机器可执行的"像不像"标准

对应解法：**依据机器化、角色分离、验收脚本化**。

## 总流程

```
逐页循环（一页一停）：
  1. 跑依据包生成脚本（输入页面名 → 节点树+wxss+app-config+云函数调用清单）  ← 脚本，零幻觉
  2. 照依据包写页面                                                      ← agent 只干这个
  3. 跑静态验收脚本（产物存在/类名抽查/钩子注册/无残留）                    ← 脚本
  4. 对账员独立 diff（只给解包原文 + 产出，不给还原过程）                   ← 第二双眼睛
  5. 修 diff → 编译 → 更新进度清单 → 停下等用户验收                        ← 用户是终审
```

## 阶段 0：全局基建前置（最大提速点）

全局坑必须第一周打穿，否则每页踩一遍：

1. **全局样式**：确认原版 app.wxss 是否组件库（ColorUI/thorui 等），提取并在 App.vue 引入
   （提取出的 CSS：`rpx` 全换 `px`；变量定义在 `body{}` 的补 `page` 兜底）
2. **导航栏规则**：从 app-config.json 逐页确认 custom/系统栏；系统栏页**禁止自绘 `.header`**
3. **数据加载架构**：数据放 `src/data/`，Vite 构建期 `import.meta.glob` 打进 JS。
   **绝不**运行时 `readFileSync` 读包内文件（真机必挂，H5 却正常——极易误判已跑通）。
   eager 与 lazy 的 glob 不能重叠，否则 rollup 静默不打包
4. **分享钩子**：`onShareAppMessage` 必须 `import { onShareAppMessage } from '@dcloudio/uni-app'`
   注册，`<script setup>` 里的同名函数是死函数
5. **状态机空壳**：函数名 = 原云函数名，先通后真

做完一页最典型的页面（骨架页）验证以上全部生效，再批量铺。

## 逐页铁律

| 铁律 | 内容 |
|---|---|
| 尺寸换算 | wxss 提取产物 `n/2 = 375pt 宽下的 px`，**提取值直接当 px 抄，不要再除 2**；配 `"transformPx": false` |
| 权威优先级 | 节点树 > wxss > appservice > 记忆。任何"凭印象补 UI"都是返工 |
| 资源路径 | 封面/音频用原版字段（`cover`/`cover_big`），不从本地目录猜（本地有文件 ≠ CDN 有路径） |
| 音频规律 | 先摸清命名规律再批量（如"页音频=页图换扩展名"命中率可到 99%，按标题猜只有 29%） |
| 一页一停 | 一页一个 commit：写完→编译→验收→停，绝不顺手改别的页 |

## 对账员（独立视角）

- **信息隔离**：只给解包原文 + 产出文件，不给还原理由——让它无法"理解你为什么这么写"，只能硬对
- **输出 diff 清单不改代码**，分三级：数值错误（必修）/ 结构缺失（必修）/ 写法差异（可忽略）
- 前两级清零才算对账通过；每次只对一页

## 验收手法速查（可脚本化为 check_page.py）

```bash
ls dist/build/mp-weixin/pages/<p>/                                    # 产物四件齐全
grep onShareAppMessage dist/build/mp-weixin/pages/<p>/<p>.js          # 分享钩子已注册
grep -c "class=\"header\"" dist/build/mp-weixin/pages/<p>/<p>.wxml    # 应为 0（系统栏页）
grep -o "关键类名" dist/build/mp-weixin/pages/<p>/<p>.wxml             # 关键类进了产物
wc -c dist/build/mp-weixin/app.wxss                                   # 全局样式体积达标
tar czf - -C dist/build mp-weixin | wc -c                             # 主包 < 2MB
```

注意：CDN 可达性、音频播放需真机/开发者工具人工验证——"资源 404"不是代码 bug，不要去改代码。

## 诚实边界

- 视觉终审只能是人：机器拦 90% 的数值/结构漂移，"像不像"最后一关用户目测
- 1:1 包括复刻原版 bug：遇到原版的 off-by-one 之类显示 bug，停下来让用户裁决复刻还是修正
- 规范是活的：每页对账完把新坑回写本技能，一行就够
