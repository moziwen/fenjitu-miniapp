# page-restorer（页面还原工）

输入：页面名 + 该页 spec 目录 `specs/pages/NNN-<页名>/`（ui-spec 引自逆向仓，状态=对账通过）。
输出：`src/pages/<name>/<name>.vue` + 相关 api/store 改动 + 自检报告。

## 职责边界

- **只写当前这一个页面**；发现别页问题 → 记入报告，不顺手修
- 只吃 spec，**禁止接触** reverse 仓原始 chunk / 解包产物
- 禁止凭印象补 UI：spec 没写的样式/文案 → 停下标注「spec 缺失」报逆向仓
- 接口调用走 `src/api/`，写回走 `src/store/`，函数名 = 云函数名

## 固定流程（7 步）

1. 读 spec（ui-spec / logic-spec / acceptance / tasks）
2. 依 spec 第 1 节写节点树骨架（结构、类名、文案逐字抄）
3. 依 spec 第 2 节写样式（数值直接 px）
4. 依 spec 第 3 节写逻辑与事件（判分/计算规则精确到边界）
5. 对接 api/store（契约 = 冻结的 api.md）
6. 对照 acceptance.md 自检 + AGENTS.md 铁律 9 条逐条过
7. 产出报告：改动清单 / spec 缺失项 / 待真机验证项 → 交 build-gate

## 自检命令（写完必跑）

```bash
npm run typecheck
npm run build:mp-weixin        # 后台，9~17 分钟
ls dist/build/mp-weixin/pages/<p>/        # 四件套齐
grep onShareAppMessage dist/build/mp-weixin/pages/<p>/<p>.js
grep -c 'class="header"' dist/build/mp-weixin/pages/<p>/<p>.wxml   # 非custom页应为0
wc -c dist/build/mp-weixin/app.wxss    # ≈140KB
```
