# fenjitu-miniapp 开发约定（AGENTS 必读）

前端仓：uni-app 3 + Vue 3 + TypeScript，编译目标 `mp-weixin`，1:1 还原「英语分级兔」。
**唯一输入是 reverse-fenjitu 仓的 `specs/pages/<页名>.md`**，禁止接触原始 chunk / 解包产物。

## 强制规范

1. **一页一停**：一次只推进一个页面。写完 → build-gate 全绿 → 更新 PROGRESS.md → 停下等用户验收。禁止顺手改别的页（全局 bug 例外，但需单独声明）。
2. **spec 先行**：动手前该页 spec 必须处于「对账通过」状态。发现 spec 有误 → 停下，报逆向仓改 spec 并记录变更，**不许前端顺手改 UI 结论**。
3. **依据机器化**：类名/文案/尺寸/事件一律从 spec 抄，禁止凭印象写 UI。
4. **SDD**：每页在 `specs/pages/NNN-<页名>/` 维护 ui-spec.md（引自逆向仓）、logic-spec.md、acceptance.md、tasks.md；全局基建在 `specs/000-global-infra/`。
5. 文件 UTF-8，注释中文，commit message 中文。

## 铁律（违反必返工，来自上一轮实战）

| # | 铁律 | 后果 |
|---|---|---|
| 1 | 数据放 `src/data/`，Vite 构建期 `import.meta.glob` 打包；**绝不**运行时 readFileSync 包内文件（真机必挂，H5 正常——极易误判已跑通） | 真机白屏 |
| 2 | eager 与 lazy 的 glob **不能重叠**，否则 rollup 静默不打包 lazy | 数据缺失 |
| 3 | wxss 数值直接当 px 抄（不除 2），配 `transformPx: false` | 全页尺寸错 |
| 4 | 仅 index/daka 是 custom 导航栏可自绘顶栏；**其余页系统导航栏，禁止自绘 `.header`** | 双导航栏 |
| 5 | 分享钩子必须 `import { onShareAppMessage } from '@dcloudio/uni-app'` 注册，函数声明形式是死代码 | 分享失效 |
| 6 | 封面用原版 `cover`/`cover_big` 字段真实路径；禁止从本地目录猜路径 | 本地有文件但 CDN 404，极难排查 |
| 7 | 页音频 = 页图文件名换扩展名（`cat.jpg` → `cat.mp3/cat0.mp3/cat1.mp3`），命中率 99% | 音频 302 找不到 |
| 8 | ColorUI 全局样式在 App.vue @import（`rpx` 全换 `px`、`body{--` 补 `page` 兜底） | 全局类空规则 |
| 9 | 资源 404 ≠ 代码 bug：CDN 可达性沙箱测不了，先报告用户，不许改代码「修」资源问题 | 无效返工 |

## 状态机与接口

- `src/store/`：状态机函数名 = 原版云函数名（对账时肉眼可查）
- `src/api/`：唯一请求出口，页面禁止直接 `uni.request`；接口契约以 reverse 仓 `specs/api/api.md`（冻结 tag）为唯一事实源
- 响应包络 `{ code, msg, data, request_id }`；错误码做枚举判断，不判断 msg 文案

## 质量门禁（build-gate 执行）

- `npm run typecheck` + `npm run build:mp-weixin` 全绿（编译慢，必须后台跑）
- 产物检查：该页 `dist/build/mp-weixin/pages/<p>/` 四件套齐
- `grep onShareAppMessage` 命中该页产物 js
- `grep -c 'class="header"'` 该页 wxml = 0（非 custom 页）
- `wc -c dist/build/mp-weixin/app.wxss` ≈140KB（ColorUI 生效）
- 主包 < 2MB
- 视觉对账：微信开发者工具人工目测 = 用户终审（agent 无法替代）
