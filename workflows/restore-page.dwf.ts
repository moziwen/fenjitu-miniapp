/* zcode-workflow
name: restore-page
description: 前端仓单页还原流水线：page-restorer 写页 → build-gate 门禁 → 不过自动回修（最多2轮）
whenToUse: fenjitu-miniapp 仓还原单个页面时；一次只跑一页（一页一停）
*/
/* zcode-workflow args:
page:
  type: string
  required: true
  description: 页面名，如 cardQuiz
repo:
  type: string
  required: false
  default: D:/webwork/fenjitu-miniapp
*/

interface BuildOutcome { gate: 'PASS' | 'FAIL'; failures: string; evidence: string }

const page = String(args.page)
const repo = String(args.repo ?? 'D:/webwork/fenjitu-miniapp')
const specDir = `${repo}/specs/pages/` // NNN-<page> 目录由还原工自行定位

phase('照 spec 还原页面')
const built = agent('page-restorer').ask<{ report: string; specGaps: string }>(
  `你是 page-restorer。先读 ${repo}/AGENTS.md（铁律 9 条必须逐条遵守）与 ${repo}/agents/page-restorer.md。
还原页面：${page}，spec 目录在 ${specDir} 下以 NNN- 开头匹配 "${page}"；若该目录不存在或 ui-spec 状态不是「对账通过」，停下并在报告说明，禁止动手。
按 spec 写 ${repo}/src/pages/${page}/${page}.vue，接口走 src/api/，写回走 src/store/，函数名=云函数名。
只准改本页相关文件；发现其他页问题只记录不顺手修。返回改动报告与 spec 缺失项。`
)
log(`page-restorer 完成：${page}`)

phase('编译与静态验收门禁')
let outcome = await agent('build-gate').ask<BuildOutcome>(
  `你是 build-gate，只验收不修码。先读 ${repo}/agents/build-gate.md 的门禁清单（8 项全查）。
验收对象：${repo} 的 ${page} 页。
编译慢（9~17分钟）必须后台执行；微信开发者工具可能锁 dist 根目录，只清内部文件。
返回 gate=PASS/FAIL，FAIL 附最小错误定位（文件+行号），evidence 字段放关键命令输出摘录。`
)

let round = 1
while (outcome.gate === 'FAIL' && round <= 2) {
  log(`gate 第 ${round} 轮 FAIL，回修`)
  phase(`回修第 ${round} 轮`)
  await agent('page-restorer').ask<string>(
    `gate FAIL，只修失败项，不做无关改动。失败定位：
${outcome.failures}
${repo} 的 ${page} 页。修完简述改了什么。`
  )
  outcome = await agent('build-gate').ask<BuildOutcome>(
    `复验 ${repo} 的 ${page} 页，门禁清单 8 项全查（不只查上次失败项）。返回 gate 与 evidence。`
  )
  round += 1
}

return {
  page,
  gate: outcome.gate,
  evidence: outcome.evidence,
  restorerReport: built.report,
  specGaps: built.specGaps,
  nextStep: outcome.gate === 'PASS'
    ? '把 gate 报告贴入该页 tasks.md，更新 PROGRESS.md，停下等用户视觉终审'
    : '连续 2 轮 FAIL，上报用户，不进入第 3 轮'
}
