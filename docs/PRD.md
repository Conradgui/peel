---
title: Peel — Product Requirements Document
version: v0.1.0
date: 2026-05-14
status: Draft (Brainstorm Complete · Pre-Implementation)
author: Conrad (product owner) · Claude Opus 4.7 (drafting assistant)
brainstorm_session: 2026-05-06 → 2026-05-14
repo: https://github.com/Conradgui/peel
branch: claude/init-peel
---

# Peel — Product Requirements Document

> Peel back the assumptions about your time.

---

## Contents

1. [产品定位](#1-产品定位)
2. [核心闭环：24h 双 aha 击穿模型](#2-核心闭环24h-双-aha-击穿模型)
3. [MVP 范围 + 非目标](#3-mvp-范围--非目标)
4. [IA 三页布局](#4-ia-三页布局)
5. [数据模型](#5-数据模型)
6. [关键差异化 UI 流程](#6-关键差异化-ui-流程)
7. [设计语言完整规范](#7-设计语言完整规范)
8. [验收标准](#8-验收标准)
9. [v1.1+ Backlog](#9-v11-backlog)
10. [更新日志](#10-更新日志)

附录: [A 颜色 palette](#附录-a-颜色-palette) · [B 字体阶梯](#附录-b-字体阶梯) · [C 文案模板池骨架](#附录-c-文案模板池骨架)

---

## 1. 产品定位

**Peel** 是给**效率焦虑型学生 / 职场新人**用的时间管理工具。核心范式：**record-first, plan-second**——先记录真实发生的时间（reality），再校准成可信的计划（plan）。

### 1.1 目标用户

效率焦虑型学生 / 职场新人。

**核心痛点**：计划失败感——"早上列 8 件事，晚上做完 2 件，自我怀疑日积月累，对自己时间预期彻底失控"。

**用户语言（场景词）**：

- "我又没做完"
- "我以为我能..."
- "时间都去哪了"
- "我太废了"

### 1.2 差异化定位

| 工具类别 | 代表 | 解决什么 | 与 Peel 关系 |
|---|---|---|---|
| 任务执行类 | Forest, 番茄 Todo, 滴答清单 | 帮你做完今天的 todo | 不解决"预期校准" |
| 时间记账类 | Toggl, RescueTime, Clockify | 让你看时间去哪了 | 偏报表，不修复预期 |
| 笔记日历类 | Notion Calendar, Cron | 时间块管理 | 偏规划，无 record-first |
| **Peel** | — | **用真实数据帮用户重建对自己时间的预期** | 全新定位 |

### 1.3 名字哲学

**Peel** = 柑橘皮（视觉品牌锚点）+ "peel back the assumptions about your time"（剥开你对时间的假设）。

- 名字 = 产品哲学，**双层语义**（品牌 + 范式）
- 命名层级与 Things（"东西"）、Notion（"概念"）、Linear（"线性"）同——抽象诗意，不直接说功能
- 4 字母极简，国际化好

### 1.4 非目标（明确不做）

| 类别 | 原因 |
|---|---|
| 协作 / 共享 / 多人 workspace | 不在 Peel 定位内 |
| 跨设备同步 | v1 仅 H5 + localStorage；专注一个主设备使用 |
| 推送 / 通知 / banner | 反工具感 + 反"商业塞东西" |
| 第三方集成（Calendar / Notion / Slack）| v1 保持纯净 |
| 移动原生 app | v1 仅 H5（不做 iOS / Android / WeChat MiniProgram）|
| 游戏化（徽章 / 连胜 / levelup）| 反油腻鼓励 |
| AI 文案 / LLM API 调用 | 模板池足够，避免接 API 的工程复杂度 |

---

## 2. 核心闭环：24h 双 aha 击穿模型

Peel 的 retention 设计核心：**用户在 24 小时内被产品价值击穿两次**。

```
工作中 (A)            晚上 (B)              第二天早上 (C)
开始/停止计时    →    看今天真实数据    →    看历史 + 今天建议
(无门槛入口)         (第一次 aha)         (第二次 aha)
```

### 2.1 三个时点的角色

- **A 基础设施**：日常摩擦最低，让用户用上。**Now 页**是 A 的舞台。
- **B 第一次 aha**：晚上"今天专注 4h 12min ✦ 本周日均 3h 45min"——真实数据让用户"被看见"，建立"原来我没那么废"的认知矫正。**Reflection 页**是 B 的舞台。
- **C 第二次 aha**：早上"过去 7 天，你的高效时段集中在 9-11 点"——app 用用户自己的数据帮他列今天。**Today 页**（早晨建议区）是 C 的舞台。

### 2.2 为什么双 aha 比单 aha 强

传统时间管理 app 多是**单次 aha**——用户看一次报表惊叹一下，记住后不再回来。双 aha 是**晚上看 + 早上再看**：24 小时内两次价值兑现，比一次击穿后用户忘了再打开稳定得多。

**这是 Peel 与所有竞品的 retention 设计核心差别**——既是产品力体现，也是面试 elevator pitch 核心论据。

### 2.3 隐藏挑战（onboarding 必须解决）

A 用户群（效率焦虑学生 / 职场新人）对自我管理工具的耐心极低——他们已经放弃过 N 个 to-do app，"再装一个 X"的怀疑很强。Peel 必须在 **1-2 次使用内**让用户感受到"这次不一样"。这对 onboarding / 首次使用体验要求很高。

---

## 3. MVP 范围 + 非目标

### 3.1 v1 必做（最小可上线集）

**核心闭环（差异化必做）**：

1. **计时**：开始 / 暂停 / 停止 + label（任务名）+ 持久化（页面刷新或关 tab 不丢失正在进行的计时）
2. **今天的时间块**：今天所有 record 的可视化拼图（Today 页主体）+ 编辑/删除单块
3. **B 复盘视图**：今天总结（总专注时长 + 时间块数 + 拼图）+ 温暖文案（模板池 + 数据填充）+ 历史**左右翻页**（按天 / 按周）
4. **C 启动视图**：早晨打开自动呈现"过去 7 天高效时段 heatmap"——**呈现规律，让用户自己决策**（不是 app 替你建议）

**基本功能（融进 record-first，不独立成模块）**：

5. **Todo**：挂到 record 上（详见 § 6.1）
6. **番茄钟**：作为计时器的一种模式（详见 § 6.2）

### 3.2 v1.1+ 推迟

详见 § 9 完整 backlog。简要：

- 日历周月视图
- 数据导入（v1 只做导出）
- 暗色模式
- 快捷键
- 翻页时钟 + 橘子圆环（含 50/60 min 时钟决定）
- IndexedDB 升级
- File System Access API

### 3.3 Hard No（永不做）

- 协作 / 共享 / 多人 workspace
- 跨设备同步（云同步）
- 推送 / 通知 / banner
- 第三方集成
- 移动原生 app（v1 仅 H5）
- 游戏化（徽章 / 连胜 / levelup）
- AI 文案 / LLM API 调用

---

## 4. IA 三页布局

### 4.1 顶层导航

**顶部 segmented control**：

```
┌────────────────────────────────────────┐
│        [ Now | Today | Reflection ]    │ ← segmented
├────────────────────────────────────────┤
│           [当前页内容]                  │
└────────────────────────────────────────┘
```

- 三页是**平级对等**关系（不是 home + secondary）
- 视觉轻盈，反对底部 tab bar（工具感强）
- 与"清新自然 + 一点禅意"契合

### 4.2 默认进入

**总是 Now 页**——不智能时段默认。符合"app 不替你决策"原则，让用户自己切换。

### 4.3 Now 页（计时主入口，最克制）

**布局**：

```
┌────────────────────────────────┐
│  [ Now | Today | Reflection ]   │
│                       Normal ●━○│ ← 右上角 toggle switch
├────────────────────────────────┤
│                                │
│  ← 你正在做什么？               │ ← 任务名（计时进行时大字 32px）
│                                │
│            00:23:14            │ ← Display 80px 巨字
│                                │
│        [⏸ 暂停]   [⏹ 结束]      │ ← 圆角按钮
│                                │
│   ────────────────────────     │
│      今天已专注 4h 12min  ✦     │ ← Footnote 12px footer
└────────────────────────────────┘
```

**核心约束**：

- 页面**只承载"当前正在做什么"**——不显示 plan / todo / 时间块
- 留白占 60%+
- footer 那行"今天已专注 X"是唯一的次要信息

**未开始计时态**：

- 任务名变输入框（placeholder `"你正在做什么？"`）
- 点击输入框 → 弹出**今天 todo 列表 + "或打新任务..."**（详见 § 6.1）
- 计时变大圆"开始"按钮
- **橘子惊喜点首次登场**：角落放剥开一半的橘子小图标（< 20px）

### 4.4 Today 页（今天全景 — "plan vs reality"）

**布局（左右分，桌面）**：

```
┌───────────────────────────┬───────────────────────────┐
│  今天的计划                │  今天的时间块 (4)          │
│  ─────                    │  ─────                    │
│                            │                            │
│  ○ 写 PRD § 4 章节        │  ┌────────┐               │
│     目标 1h               │  │ 写代码  │                │
│                            │  │ 1h 2m  │                │
│  ○ 看完 Karpathy 视频      │  │ 9:30   │                │
│     目标 30min             │  └────────┘               │
│                            │                            │
│  ● 写每日总结              │  ┌────────────┐           │
│     完成 ✦                │  │ Peel PRD   │            │
│                            │  │ 47min      │           │
│  [+ 加任务]                │  │ 10:32      │           │
│                            │  └────────────┘           │
│  ─────                    │                            │
│                            │  ┌──┐                      │
│  早晨建议                  │  │午│  12:15              │
│  高效时段 9-11 点 ↑        │  │餐│                      │
│  ▏▏▏▏▎▍▎▏▏▏            │  └──┘                      │
│                            │                            │
│                            │  ┌────────┐               │
│                            │  │学 Next │                │
│                            │  │ 1h 45m │                │
│                            │  │ 14:00  │                │
│                            │  └────────┘               │
│                            │                            │
│                            │  今天累计 4h 12min         │
└───────────────────────────┴───────────────────────────┘
```

**手机 H5**：退回上下分布局（同样不滚动）。

**核心约束**：

- 单屏看完今天**计划 vs 现实**对比
- 反滚动 —— 内容超过一屏时**合并相邻同 label 的块**降密度
- 时间块宽度按时长比例 + 颜色按 label 类别 + 4px gap 让块呼吸
- 字体大一点 + 内容丰富 → **不空旷**（留白 ≠ 空旷）

### 4.5 Reflection 页（晚上复盘 + 历史）

**布局**：

```
┌────────────────────────────────┐
│   ◀     2026 年 5 月 14 日  ▶   │ ← 左右翻页
│                                │
│              4h 12min          │ ← 巨字总专注
│        本周日均 3h 45min        │
│                                │
│   时间拼图（同 Today 下半屏视觉）│
│   ┌──┐ ┌────┐ ┌──┐ ┌──────┐    │
│                                │
│   今天有 6 个时间块被认真度过 ✦ │ ← 模板池温暖文案
│   今天 1 场橘子雨                │ ← 橘子雨统计
│                                │
│   ────────────────             │
│   [按周 ▾] [按天 ▾]            │ ← 翻页粒度
└────────────────────────────────┘
```

**核心约束**：

- 一屏 = 一天的故事
- 翻页用**左右箭头 / 键盘 ←→**，不滚动
- 文案从模板池随机 pick，同一句不连续两天复用
- "按周"模式（v1 必做）：一屏显示一周 7 个迷你拼图 + 周总结

### 4.6 viewport-as-page 硬约束

四条不可违反规则：

1. Now / Today / Reflection 每页**单屏完整**——内容超出立刻减元素，禁止滚动展开
2. 禁止"下方 secondary 区""上滑抽屉""长列表无分页"等所有"滚动割裂"形态
3. 长列表（如历史记录）用**分页 / 左右翻页**而非滚动
4. 模态 / 弹层用完即关，不破坏主屏

**最小可用 viewport**：

- 桌面：1440 × 900
- 手机 H5：375 × 812

---

## 5. 数据模型

### 5.1 教学：数据模型 = 产品定位的工程化体现

数据模型不只是工程师的事——**它是产品定位在代码层面的具体形态**。Peel 的差异化"todo 挂 record / 番茄钟作为模式"如果数据模型设计错了，UI 怎么修都救不回来。

举例：

- 如果 Todo 和 Record 是**两张完全独立的表**（无外键）→ 就是两个独立模块 → Toggl / Asana 路线 → 违背 Peel 定位
- 如果 Pomodoro 是独立 entity（有专门 pomodoroSession 表）→ 番茄就是独立模块 → 也违背定位
- **正确的数据模型** 让"Todo 和 Record 在数据层就联结"、"Pomodoro 不是独立类型，是 Record 的一个 tag"——这才是产品定位的真实兑现

**记住**：产品定位**先决定数据模型，再决定 UI**。

### 5.2 核心 Entity

#### Record（一条时间记录）—— 产品的核心 atom

每次用户「开始 → 停止」计时，产生一个 Record。

```typescript
interface Record {
  id: string                       // 唯一 ID（uuid）
  label: string                    // 任务名（"写 PRD"）
  startTime: number                // 开始时间戳（毫秒）
  endTime: number                  // 停止时间戳
  duration: number                 // 时长（秒），= (endTime - startTime) / 1000
  tag?: 'pomodoro' | null          // 番茄钟标识（不是独立模块的关键）
  linkedTodoId?: string | null     // 挂到哪个 todo（可空 = 自由 record）
  notes?: string                   // 用户备注（v1.1）
  createdAt: number
  updatedAt: number
}
```

#### Todo（一个待办任务）

用户在今天 plan 里列的任务。

```typescript
interface Todo {
  id: string
  text: string                     // 任务名
  status: 'pending' | 'in_progress' | 'done'
  estimatedDuration?: number       // 用户预估（分钟）
  // ⚠️ actualDuration 不存——每次显示时从 records 反查计算
  date: string                     // 'YYYY-MM-DD' 哪天的任务
  createdAt: number
  completedAt?: number
}
```

#### Plan（一天的计划）—— 不是独立 entity

```ts
// Plan 是查询，不是存储实体
const plan = todos.filter(t => t.date === '2026-05-14')
```

#### Settings（用户偏好）

```typescript
interface Settings {
  orangeRainInterval: 15 | 30 | 45 | 60 | 'off'  // 橘子雨频率（默认 30）
  orangeRainSound: boolean                        // 橘子雨声音（默认 false）
  pomodoroWork: number                            // 番茄工作时长（默认 25 分钟）
  pomodoroBreak: number                           // 番茄休息时长（默认 5 分钟）
  pomodoroCycleCount: number                      // 一组多少周期（默认 4）
  // v1.1: clockCycleMinutes（50 / 60 双时钟模式）
  // v1.1: theme（light / dark）
}
```

### 5.3 关键关系（差异化的工程兑现）

#### Todo ↔ Record —— "todo 挂到 record 上"的真实形态

**不是平行的两张表，是一对多关系**：

```
Todo (1) ─────── (n) Record
  └─ 通过 Record.linkedTodoId 联结
```

**用户视角的流转**：

```
1. 用户 Today 页加 todo "写 PRD § 5"          → 创建 Todo (status=pending)
2. 用户切 Now 页，从输入框选 "写 PRD § 5"      → 任务名填入
3. 计时进行中                                → Todo.status 自动变 in_progress
4. 用户按"停止"                               → 创建 Record (linkedTodoId=todo.id)
5. 用户回 Today 页，看见 todo 旁边显示 "已记录 47min"   ← 从 records 反查计算
6. 用户标记 todo 为 done                      → Todo.status='done', completedAt=now
```

**关键工程点**：Todo 的实际时长**不存储**——每次显示时从 records 反查：

```ts
records
  .filter(r => r.linkedTodoId === todo.id)
  .reduce((sum, r) => sum + r.duration, 0)
```

这避免了"修改 record 后 todo 数字不同步"的数据不一致问题。

#### Record ↔ Pomodoro —— "番茄钟作为计时模式"的真实形态

**不是独立 entity**，只是 Record 的一个 tag：

```
Pomodoro 模式 → 计时器 → 产生 Record(tag='pomodoro')
Normal 模式   → 计时器 → 产生 Record(tag=null)
```

两种 record 在数据层完全相同，**只在 UI 层视觉区分**（番茄 record 多一个小 🍅 图标）。

**关键点**：Reflection 拼图渲染时不分 pomodoro vs normal——它们都是 record，只是某个有 tag。这让产品定位"番茄不是独立模块"在数据层就成立。

### 5.4 存储方案：localStorage Schema C

v1 仅 H5 + Hard No 跨设备同步 → localStorage。

**Schema C: 按 entity type 分 key**

```ts
'peel-records': { [date: string]: Record[] }   // date = formatDate(record.startTime, localTz)
'peel-todos':   { [date: string]: Todo[] }     // date = todo.date (用户创建时指定)
'peel-settings': Settings

// formatDate(timestamp) → 'YYYY-MM-DD' in user's local timezone
// 跨午夜归类：用 startTime 派生 date，确保归到"开始那一天"（§ 5.5）
```

**选 C 的理由**：性能 + 实现复杂度最优平衡。Reflection 按周拼图的查询路径最直接（只读 `peel-records` 一个 key）。

**容量预估**：localStorage 一般 5-10MB。

- 一条 record JSON ~150 bytes
- 每天 50 条 × 365 天 = 2.7MB
- 远在容量内。v1 不必担心

**容量警告阈值**：累计数据 > 4MB → 设置页提示"建议导出备份"。

**写入策略**：write-on-change（每产生新 record 立即写入），不做批量延迟写入。

### 5.5 边界情况

#### 跨午夜处理

用户 23:55 开始 → 0:30 停止——record 归类哪一天？

**决议：按 startTime 归类**。简单 + 符合"我什么时候开始干这件事"的语义。

#### 数据导出（v1 必做兜底）

设置页 "导出 JSON" 按钮 → 下载 `peel-data-YYYY-MM-DD.json`，内容含所有 records + todos + settings，格式化人类可读。

#### localStorage 风险

⚠️ **localStorage 不是真正的本地文件**——它是浏览器管理的存储区，浏览器有权清除。

清理风险场景：

- 用户在浏览器选"清 cookies + 站点数据"（部分用户会这样做）
- 用户使用无痕模式（会话结束自动清）
- 用户换设备 / 卸载浏览器
- 磁盘空间不足，浏览器自动 evict（罕见）

**多数用户日常"清缓存"=只清 HTTP Cache，不影响 localStorage** —— 风险有限但真实存在。

**v1 策略**：
- 主存：localStorage（schema C，write-on-change）
- 兜底：JSON 导出按钮（让用户自己保管 JSON 文件）
- v1.1+ backlog：考虑 IndexedDB / File System Access API

---

## 6. 关键差异化 UI 流程

### 6.1 Todo 挂 Record —— Now 页内置 todo 选择器

**取消 Today 页的 ▶ 按钮**（违反 IA 纪律：Today 是 plan vs reality 视图，不该是"第二个开始计时入口"）。

**最终方案：Now 页输入框点击 → 弹出今天 todo 列表**：

```
Now 页（未开始计时）:
┌────────────────────────────────┐
│                       Normal ●━○│
├────────────────────────────────┤
│                                │
│  ← 你正在做什么？               │ ← 输入框
│   ┌─────────────────────┐      │ ← 点击输入框时弹出
│   │ 今天的 todo (3)      │      │
│   │  ○ 写 PRD § 6        │      │
│   │  ○ 看 Karpathy 视频  │      │
│   │  ○ 写每日总结        │      │
│   │ ─────────────        │      │
│   │ 或者打一个新任务...   │      │
│   └─────────────────────┘      │
│                                │
│    00:00:00                    │
│    [开始]                      │
└────────────────────────────────┘
```

**用户旅程**：

1. 创建 todo：Today 页 [+ 加任务]
2. 开始计时：Now 页输入框 → 选今天 todo OR 打新任务 → 点开始
3. 关联自动建立：选了 todo 的 record 自动 `linkedTodoId = todo.id`
4. 自动状态：todo.status 自动 pending → in_progress（开始计时时）
5. 完成 = **用户主动标记**（不自动）—— 标记的瞬间是 B 情感成就感舞台
6. 取消关联（v1 做）：计时进行中点 ⌁ × → linkedTodoId = null
7. 事后挂 todo（v1 做）：Today 页时间块点击 → 选 todo 关联

**Today 页 todo 点击 → 详情面板**（弹层）：编辑文案 / 标记 done / 删除 / 取消关联 —— **但不直接开始计时**。职责分离。

### 6.2 番茄钟模式 —— Toggle Switch + 底色 tint

**Now 页右上角加一个 toggle switch**：

```
状态切换:                  视觉信号:
[Normal ●━○]               底色保持 Cream White
   ↓ 用户切                ────────────────
[○━● Pomodoro]             底色变 Pomodoro tint (#FEF3E7)
                           任务名旁出现 🍅
                           计时变 "25:00 倒计时"
                           开关滑动用 spring 阻尼大 + 缓出
```

**两种模式核心差别**：

| 维度 | Normal | Pomodoro |
|---|---|---|
| 计时方向 | 正向计时 | 倒计时 25min（默认） |
| 完成方式 | 用户按"停止" | 时间到自动结束 |
| 完成行为 | 创建 Record(tag=null) | 创建 Record(tag='pomodoro') + **强制触发橘子雨** |
| 视觉差别 | 普通数字 | 数字旁边 🍅 + 底色 tint |

**休息阶段（番茄独有）—— Now 页就地切换 fade 过渡**：

```
工作完成 25:00:               同页 fade 过渡 2s:
┌───────────────────┐         ┌───────────────────┐
│  写 PRD § 6        │         │     休息中 ☕      │
│                   │  渐变   │                   │
│  25:00 / 25:00 ✓  │  ━━▶   │   05:00 倒计时    │
│  完成！橘子雨触发  │         │  [跳过]  [继续工作] │
└───────────────────┘         └───────────────────┘
```

- 不切页 —— Now 页内容 fade 替换
- 底色变化（Cream White → Rest tint `#E8F5F0` 极淡薄荷绿）暗示"另一种状态"
- 休息阶段**不创建 Record**（休息不是工作时间）
- 休息 5min 倒计时结束 → 弹"开始下一个番茄？" → 用户选 → 回到工作态

### 6.3 这些 UI 兑现的产品定位

| 产品定位 | UI 流程兑现 |
|---|---|
| "todo 挂到 record 上" | Now 内置 todo 选择器 → record 自动 linkedTodoId → todo 时长反查 |
| "番茄钟不是独立模块" | Now 页一个 toggle 切换模式；番茄产生的 record 和普通 record 数据同构，只多一个 tag |
| "app 不替你决策" | todo 不自动 done（用户主动标记）；番茄结束后让用户选下一步；C 视图呈现规律不替你建议 |
| "成就感语调温暖不评判" | todo 标记 done 时的微动效 + 模板池文案（无对比"以为"语调）|

---

## 7. 设计语言完整规范

### 7.1 颜色 palette

**主色（Peel Orange 系，唯一 accent）**：

| 角色 | hex | 用途 | Tailwind |
|---|---|---|---|
| Peel Orange Light | `#FED7AA` | hover / 浅色背景 tint | orange-200 |
| Peel Orange（主）| `#FB923C` | 主按钮 / 关键数字 / hover accent | orange-400 |
| Peel Orange Deep | `#EA580C` | 强调文字 / "完成"成就色 | orange-600 |

> 选 orange-400 而非 orange-500（之前定的 `#F97316`）是因为后者在 Cream White 背景上饱和度过高，与"清新自然柑橘调"调性冲突。整体色阶往浅一档让产品更"皮肤友好"。

**背景（米暖色系）**：

| 角色 | hex | 用途 |
|---|---|---|
| Cream White | `#FAFAF7` | 页面主背景 |
| Pure White | `#FFFFFF` | 卡片底（需对比时） |
| Off White | `#F5F5F0` | 区域分隔背景 |

**文字（暖灰，不纯黑）**：

| 角色 | hex | 用途 |
|---|---|---|
| Text Primary | `#1F1F1B` | 主文字、标题 |
| Text Secondary | `#52524D` | 副文字、meta |
| Text Tertiary | `#A3A3A0` | 提示文字、placeholder |
| Border | `#E5E5DF` | 分割线 |
| Border Subtle | `#F0F0EB` | 极淡分割 |

**模式特殊色（极轻 tint）**：

| 模式 | 背景 hex | 用途 |
|---|---|---|
| Pomodoro 模式启用 | `#FEF3E7` | Now 页底色（2% 橘黄 tint） |
| 休息阶段 | `#E8F5F0` | Now 页底色（极淡薄荷绿） |

**永不用**：饱和红 / 饱和蓝 / 饱和绿 / 任何 saturation > 70% 的颜色。Peel 全产品**唯一 accent = 橘子系**。

**暗色模式（v1.1 backlog）**：

- 主背景 `#1A1A18`（深暖灰，不纯黑）
- 卡片底 `#252521`
- Peel Orange 提亮版 `#FB923C` → `#FB923C` 不变 / Light → `#FDBA74` / Deep → `#F97316`

### 7.2 字体规范

**字族**：

- 主：Inter（开源免费，国际化好）
- Mono（计时数字 v1.1 翻页时钟）：JetBrains Mono / Geist Mono

**字号阶梯**（HTML mockup 实际呈现后可微调）：

| 阶 | px | line-height | 用途 |
|---|---|---|---|
| Display | 80 | 1.0 | Now 页主计时数字 |
| H1 | 32 | 1.2 | 页面主标题 |
| H2 | 24 | 1.3 | 章节标题 |
| Body Large | 18 | 1.5 | 任务名 / todo 文案 |
| Body | 16 | 1.5 | 正文 |
| Body Small | 14 | 1.5 | 副文字 |
| Caption | 13 | 1.4 | 提示 / tag |
| Footnote | 12 | 1.4 | footer 极小字 |

**字重**：

- Regular 400：正文
- Medium 500：重点
- Semibold 600：标题
- Bold 700：罕用，强调

### 7.3 间距系统

base unit = **4px**（Tailwind 默认）

| 阶 | px | 用途 |
|---|---|---|
| xs | 4 | 紧密元素之间 |
| sm | 8 | 同组元素之间 |
| md | 12 | 卡片内间距 |
| lg | 16 | 卡片之间 |
| xl | 24 | section 之间 |
| 2xl | 32 | page 主区域 |
| 3xl | 48 | page 顶部留白 |
| 4xl | 64 | hero 区域 |

### 7.4 圆角

| 用途 | radius |
|---|---|
| 按钮、小卡片 | 6px |
| 主卡片、时间块 | 12px |
| 大容器、模态 | 20px |
| 圆形按钮 / 圆点 | 9999px (full) |

**几何风格**：默认圆角柔和。**禁止锐角**（违反"清新自然"）。

### 7.5 阴影（极轻光感）

| 阶 | CSS | 用途 |
|---|---|---|
| Subtle | `0 1px 2px rgba(0,0,0,0.04)` | hover 微浮起 |
| Soft | `0 2px 8px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)` | 卡片默认 |
| Lifted | `0 4px 16px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.05)` | 模态 / 弹层 |

**禁止**：`blur > 20px` 的"重阴影"——会破坏清新感。

### 7.6 动效

**spring 参数**（Framer Motion / Motion One）：

| 命名 | damping | stiffness | 用途 |
|---|---|---|---|
| default | 25 | 200 | 大多数过渡（缓出，阻尼大不弹跳）|
| bouncy | 15 | 150 | toggle 切换 / 完成时刻 |
| slow | 30 | 100 | page transition / 大变化 |

**duration**：

| 场景 | duration |
|---|---|
| hover / focus | 150ms |
| 模式切换 / fade | 300ms |
| page transition | 500ms |
| 橘子雨整场 | 2500ms |
| Pomodoro 底色 fade | 200ms |
| 休息阶段 fade 切换 | 2000ms |

**easing**：默认 `cubic-bezier(0.32, 0.72, 0, 1)` —— 自然缓出，像水流。

### 7.7 橘子使用 White List（Guard Rail）

**✓ 允许出现的 9 处惊喜点**：

1. Favicon
2. Logo / 品牌识别
3. Now 页"未开始计时"态 —— 剥开一半橘子小图标（角落，< 20px）
4. **橘子雨**（白橘花 4-6 朵 + 1-2 个小橘子符号，30min 间隔默认）
5. Pomodoro 模式启用时的小 🍅 图标（任务名旁）
6. Pomodoro 番茄完成时**强制触发**橘子雨（不论间隔到没到）
7. 空状态插画（"今天还没开始记录..."）
8. 加载状态（subtle 旋转的橘子，< 24px）
9. Reflection 页"今天 N 场橘子雨"统计

**✗ 禁止出现的 UI 主结构**：

- 顶部 navigation 背景
- 按钮默认形态
- 卡片背景（除非空状态）
- 输入框
- 分割线
- 默认文本强调
- Toast / 通知（v1 无 toast）

**判断准则**：橘子是**惊喜的点缀**而非 UI 默认元素。如果用户每秒都能看到橘子 → 错。

### 7.8 橘子雨详细规格

| 维度 | 规格 |
|---|---|
| 视觉 | **白橘花 + 小橘子混合**：4-6 朵白色橘花（参考真实柑橘花，主体）+ 1-2 个小橘子符号（橘色锚点）从屏幕顶部边缘飘落 |
| 时长 | 2.5s |
| 频率 | 默认 30min，可配 15 / 30 / 45 / 60 / off |
| 触发 | 从按"开始"起算累计计时每达到阈值触发；暂停时计时暂停 |
| 覆盖层级 | 屏幕边缘飘落，**不遮挡交互区** |
| 声音 | 默认静音，可选极轻 0.3s 琴音"叮" |
| 兜底 | Reflection 页记录"今天 N 场橘子雨" |
| 配置入口 | 设置页 → 橘子雨间隔 dropdown |

**小橘子图形设计**：

- 橘色圆（Peel Orange `#FB923C`）+ 顶部小绿叶（一笔曲线，墨绿色）+ 极细暗橙描边（`#EA580C`）
- 尺寸：屏幕宽度 2-3%
- 轻微随机旋转角度（更自然）
- **极简抽象符号**，不是 🍊 emoji 那种详细插画 —— Linear / Things 3 level 的图形抽象

### 7.9 文案语调

**✓ 让数据说话**：

- "今天 4h 12min ✦ 本周日均 3h 45min"
- "今天有 6 个时间块被认真度过"
- "你的高产时段集中在 9-11 点"

**✓ 温暖陈述**：

- "今天是个好日子"
- "五月十四日的你 4h 12min"
- "三个时间块挂着 todo，一个自由"

**✗ 禁用**：

- "原来你这么厉害"（评价）
- "比你以为的多 30%"（"以为/想象"对比，暗含轻视）
- "You're doing great!"（AI 通用脸）
- "棒棒哒 🎉"（油腻）

### 7.10 文案模板池

v1 写 30-50 个文案模板，按场景分组，**人工撰写**（不接 LLM API），存到 `~/Desktop/peel/docs/copy-templates.json`（详见附录 C）。

模板**用插值**填充数据（如 `今天 {hours}h {minutes}min`），同一句**不连续两天复用**。

---

## 8. 验收标准

### 8.1 功能验收（Done Criteria）

#### Now 页计时

- [ ] 用户点"开始" → 计时启动，秒数每秒精确递增（≤100ms 误差）
- [ ] 点暂停 → 计时停止，再点继续 → 从暂停处接续
- [ ] 点停止 → 创建 Record（含 label / startTime / endTime / duration）
- [ ] 刷新页面 / 关 tab 重开 → 进行中的计时**恢复**（不丢失）—— 用 timestamp 计算而非 setInterval 自增
- [ ] 后台 30 min 标签页 → 回来计时仍准确

#### Today 页

- [ ] 显示今天的 plan（todo 列表）+ 今天的时间块拼图（已完成 records）
- [ ] [+ 加任务] 创建 todo（含 text / estimatedDuration）
- [ ] 点击 todo → 详情面板（编辑文案 / 标记 done / 删除 / 取消关联）
- [ ] todo 实际时长**从 records 反查**正确（多次计时累加准确）
- [ ] 早晨建议 heatmap：基于过去 7 天 records 计算 24 小时维度热力（00-23 点）
- [ ] 内容超出单屏 → 减元素（合并相邻同 label）而非滚动

#### Reflection 页

- [ ] 默认显示今天总结 + 时间拼图 + 模板池温暖文案
- [ ] 左右翻页查看历史（按天 / 按周）
- [ ] 按周模式：一屏 7 个迷你拼图 + 周总结
- [ ] "今天 N 场橘子雨" 统计正确

#### Todo 挂 Record（差异化）

- [ ] Now 页输入框点击 → 弹出今天 todo 列表 + "或打新任务..."
- [ ] 从 todo 列表选 → 任务名填入 + `linkedTodoId` 设置
- [ ] todo 状态自动 pending → in_progress（开始计时时）
- [ ] todo 完成 = 用户主动点击标记 done，**不自动**
- [ ] 取消关联：计时中点 ⌁ × → `linkedTodoId = null`
- [ ] 事后挂 todo：Today 页时间块卡片点击 → 选 todo

#### 番茄钟模式

- [ ] Now 页右上角 toggle switch 切换 Normal ↔ Pomodoro
- [ ] Pomodoro 模式：点开始 → 25min 倒计时 → 0 时自动结束
- [ ] Pomodoro 完成 → 创建 Record(tag='pomodoro') + **强制触发橘子雨**
- [ ] 自动 fade 切换到休息阶段（极淡薄荷绿底色）
- [ ] 休息 5min 倒计时结束 → 弹"开始下一个番茄？"
- [ ] 番茄设置（工作时长 / 休息时长 / 周期数）在设置页可改

#### 橘子雨

- [ ] 计时进行中每 30min（默认）触发一场橘子雨（2.5s）
- [ ] 番茄完成时强制触发一场（不论间隔）
- [ ] 视觉：4-6 朵白橘花 + 1-2 个小橘子从屏幕顶部边缘飘落
- [ ] 暂停时计时暂停 → 橘子雨不触发
- [ ] 设置可改频率：15 / 30 / 45 / 60 / off
- [ ] 静音默认，可选 0.3s 琴音"叮"

#### 数据导出

- [ ] 设置页有"导出 JSON"按钮 → 下载 `peel-data-YYYY-MM-DD.json`
- [ ] JSON 内容：所有 records + todos + settings
- [ ] 导出文件能被人类阅读（格式化 JSON）

### 8.2 性能验收

- [ ] 首次加载（cold load）≤ 2s on 4G connection
- [ ] 页面切换（Now ↔ Today ↔ Reflection）≤ 100ms
- [ ] 计时器渲染 60fps（v1.1 翻页时钟时也是）
- [ ] localStorage 单次写入 ≤ 50ms
- [ ] 橘子雨动画 60fps（含移动端 H5）

### 8.3 UX 验收（推迟到核心功能完成后做）

> 这一节的验证在 v1 核心功能完成（alpha 阶段）之后进行，不是 PRD 阶段的成本。

#### "眼前一亮" 5 秒测试

- 拉 3 位 AIPM / 设计敏感朋友：打开 Peel 第一屏，问"3 个词形容感受"
- **通过条件**：≥ 2 人提到"清新 / 简洁 / 自然 / 诗意"任一
- **失败信号**：有人提"工具感 / 拥挤 / 像 Toggl / AI 通用脸" → 回头调

#### 24h 双 aha 验证

- 5-10 位首批用户连续使用 2 天
- **通过条件**：≥ 60% 用户提到 B（晚上看真实数据）或 C（早晨看自己高效时段）作为"觉得 Peel 有用的瞬间"

#### Onboarding 1-2 次使用

- 新用户 5 分钟内能：开始/停止一次计时 + 看懂 Today plan vs reality 含义

### 8.4 兼容性验收

**支持**：

- Chrome ≥ v100（macOS / Windows）
- Safari ≥ v15（macOS / iOS）
- Edge ≥ v100
- 移动端 H5（iPhone 12 Safari + 主流 Android Chrome）

**不支持（明确取舍）**：

- **Firefox** —— 市场份额 < 5%，明确选择 Chrome + Safari + Edge 覆盖 90%+ 用户，投入工程到核心体验更聚焦
- IE / Safari < v15

**取舍说明（AIPM 简历可讲）**：基于目标用户（学生 / 职场新人）的浏览器使用画像 + 工程资源边界做的明确选择，不是"忘了适配"。

### 8.5 数据完整性 / 边界情况

- [ ] 跨午夜 record（23:55-00:30）按 startTime 归类为前一天
- [ ] 暂停超过 1 小时仍可继续（不强制超时）
- [ ] localStorage 容量警告：累计数据 > 4MB 时设置页提示"建议导出备份"
- [ ] 用户清浏览器数据 → 重开 Peel 显示空状态（不报错）
- [ ] 导出 JSON 后 → 未来 v1.1 可导入还原（v1 不做导入，schema 兼容性要保证）

### 8.6 AIPM 简历可讲指标

ship 后 v1 应该能讲出（面试用）：

- **完整产品周期**：PRD → 设计 → 实施 → ship 时长 N 周
- **用户洞察**：从"效率焦虑学生计划失败"到 record-first 范式的推导
- **设计决策**：清新柑橘调 + viewport-as-page + 50min 时钟（v1.1）+ 等
- **工程权衡**：
  - localStorage + 导出兜底 vs 后端同步
  - 模板池 vs LLM API
  - 仅 H5 vs 多端
  - 砍 Firefox 的边界判断
- **数据**：首批 5-10 用户使用 1 周后的 retention / aha 时刻 / 反馈

---

## 9. v1.1+ Backlog

按 backlog discipline 维护：**每次"推迟"决策都立刻入这里，不靠记忆**。

每项含：功能名 / 推迟原因 / 启动触发条件 / 未决子问题 / 关联章节。

| 功能 | 推迟原因 | 启动条件 | 未决子问题 | 关联章节 |
|---|---|---|---|---|
| **日历周月视图** | C 平衡派优先；v1 用左右翻页 | 用户反馈"想看月度趋势"信号强 | 月视图布局是网格 vs 时间轴？ | § 3 |
| **数据导入（从 JSON 还原）** | v1 只做导出 | 用户提"我换设备了想导入" 或 "换浏览器了" | 导入冲突处理（重复 record）？覆盖 vs 合并？ | § 5 |
| **暗色模式** | 节省 v1 设计开销 | v1.1（暖橙暗色需重新校色） | 暖橙暗色版 hex？薄荷绿暗色版？ | § 7 |
| **快捷键（Things 3 风）** | 提升非核心 | v1.1 验证 retention 后 | ⌘+1/2/3 切页是否冲突浏览器？ | § 4 |
| **翻页时钟 + 橘子圆环** | 自研复杂度高（1-2 周） | v1 上线后用户反馈"想要更有仪式感" | 1 圈 50 / 60 / 双模式？橘子涂层颜色推进规则？性能在移动端是否 60fps？ | § 4 |
| **50 min vs 60 min 双时钟** | 与翻页时钟一起 | 同上 | 60 min 直觉 vs 50 min 灵魂一致性的最终判断 | § 4 |
| **IndexedDB 升级** | localStorage 足够 | 数据量 > 5MB 或性能问题 | 迁移策略：增量 vs 一次全量？ | § 5 |
| **File System Access API（真本地存储）** | 浏览器 API 实验阶段 | Safari 完整支持后 + 用户反馈"清浏览器数据丢了" | 用户授权流程？文件路径默认？ | § 5 |
| **自定义颜色主题** | 偏离 brand 风险 | 用户群成熟、有强信号 | 允许哪些 hex 范围？ | § 7 |
| **Taro 微信小程序双端** | 仅 H5 是 v1 决议 | AIPM 简历需要"双端"卖点时 | Taro vs 重写？React Native？ | § 3 |

**Backlog 启动机制**：每项启动时 → 走一轮 1/2/3/4 → 进入 v1.1+ 开发周期。

---

## 10. 更新日志

### v0.1.0 — 2026-05-14 · PRD 初稿完成

#### Brainstorm 过程

**会话起点**（2026-05-06）：Phase 1 (Vue + UNIapp) 全部作废后的产品 v2 重做

**核心决策路径**：

- 2026-05-06 · 锁定 4 项 first-class 决策（暖橙 / Next.js / 仅 H5 / Things 3 anchor）
- 2026-05-07 · 改名 Peel（"Timing 侠"与清新柑橘调不匹配；"peel back assumptions about your time" 双层语义）+ 新仓库 `~/Desktop/peel/` + `Conradgui/peel` GitHub
- 2026-05-07 → 2026-05-14 · 完整 PRD brainstorm（§ 1-10）

#### 最终锁定

- **用户**：效率焦虑学生 / 职场新人
- **闭环**：A 计时主入口 + 24h 双 aha (B 晚上 + C 早晨)
- **成就感**：C 视觉主 + B 情感副，清新自然柑橘调
- **IA**：D3 三页（Now / Today / Reflection），每页 viewport-as-page
- **MVP**：闭环 + todo 挂 record + 番茄钟作为计时模式
- **设计语言**：清新 + 自然 + 有机 + 诗意 / 禅意 + 橘子（仅 9 处惊喜点）
- **色彩**：Peel Orange 系（`#FED7AA` / `#FB923C` / `#EA580C`）+ 米暖白底
- **时钟**：v1 普通数字，v1.1 升级翻页时钟 + 橘子圆环（50 vs 60 min 待决）
- **橘子雨**：30min 默认间隔 / 番茄完成强制触发 / 2.5s 一场 / 白橘花 + 小橘子混合
- **文案**：模板池 + 数据填充，不接 LLM API
- **存储**：localStorage Schema C + JSON 导出兜底
- **兼容性**：Chrome / Safari / Edge / 移动端 H5；**砍 Firefox**（明确取舍）
- **反约束**：反滚动割裂 / 反信息密集 / 反广告色乱 / 反油腻鼓励 / 反工具感

#### 这次 brainstorm 产生的跨项目 memory

1. `feedback_no_scroll_in_simple_tools.md` (2026-05-06) — 工具类 viewport-as-page，反滚动割裂
2. `feedback_copy_voice.md` (2026-05-07) — 反"以为/想象"对比文案 + 不接 LLM API
3. `feedback_efficiency_tool_aesthetic.md` (2026-05-07) — 诗意/禅意/眼前一亮 = 效率工具 UX 成功标准
4. `feedback_ui_communication_needs_concrete_visuals.md` (2026-05-12) — ASCII mockup 不够直观，需 HTML / Figma

#### AI 工具来源

- Brainstorm + PRD drafting：**Claude Opus 4.7 (1M context)** via anyrouter.top
- Session range：2026-05-06 → 2026-05-14（约 9 天，跨多个 session）
- Branch：`claude/init-peel`
- Methodology：`superpowers:brainstorming` skill 全流程（探索 → 澄清问题 → 方案对比 → 分章呈现 → 写文档 → 自审 → 复审）

#### 下一步

1. PRD 自审（task 7）
2. Conrad 复审 PRD 文件
3. 主动调 `frontend-design` skill 出 HTML mockup（三页 + 番茄模式 + 橘子雨）
4. 基于真实视觉效果回头调整颜色 / 字号 / 间距细节
5. 第二轮 1/2/3/4 装技术栈（Next.js + Tailwind + shadcn + Vitest）
6. Phase 1 资产复用（domain/ + 59 测试 + storage/ → 适配 Next.js SSR + React hook 重写）
7. 进入 `superpowers:writing-plans` skill 出实现 plan

---

## 附录 A 颜色 palette

完整 hex / Tailwind 映射表（v1 light mode）：

```ts
// tailwind.config.ts (excerpt)
const colors = {
  peel: {
    orange: {
      light: '#FED7AA',    // orange-200
      DEFAULT: '#FB923C',  // orange-400
      deep: '#EA580C',     // orange-600
    },
  },
  cream: {
    white: '#FAFAF7',      // page bg
    off: '#F5F5F0',        // section bg
  },
  text: {
    primary: '#1F1F1B',
    secondary: '#52524D',
    tertiary: '#A3A3A0',
  },
  border: {
    DEFAULT: '#E5E5DF',
    subtle: '#F0F0EB',
  },
  mode: {
    pomodoro: '#FEF3E7',   // pomodoro tint
    rest: '#E8F5F0',       // rest mint tint
  },
}
```

暗色模式 backup（v1.1）：

```ts
const darkColors = {
  bg: { DEFAULT: '#1A1A18', card: '#252521' },
  peel: { orange: { DEFAULT: '#FB923C' /* same */, light: '#FDBA74', deep: '#F97316' } },
  text: { primary: '#F5F5F0', secondary: '#A3A3A0' },
}
```

## 附录 B 字体阶梯

```ts
// tailwind.config.ts (excerpt)
const fontSize = {
  'display': ['80px', { lineHeight: '1.0', fontWeight: '600' }],
  'h1':      ['32px', { lineHeight: '1.2', fontWeight: '600' }],
  'h2':      ['24px', { lineHeight: '1.3', fontWeight: '600' }],
  'body-lg': ['18px', { lineHeight: '1.5', fontWeight: '500' }],
  'body':    ['16px', { lineHeight: '1.5', fontWeight: '400' }],
  'body-sm': ['14px', { lineHeight: '1.5', fontWeight: '400' }],
  'caption': ['13px', { lineHeight: '1.4', fontWeight: '400' }],
  'footnote':['12px', { lineHeight: '1.4', fontWeight: '400' }],
}

const fontFamily = {
  sans: ['Inter', 'system-ui', 'sans-serif'],
  mono: ['JetBrains Mono', 'Geist Mono', 'monospace'],
}
```

## 附录 C 文案模板池骨架

完整模板池存到 `~/Desktop/peel/docs/copy-templates.json`（v1 实施时落地）。骨架示例：

```json
{
  "version": "v0.1.0",
  "high_productivity_day": [
    "今天 {hours}h {minutes}min，是个好日子。",
    "{date} 的你 {hours}h {minutes}min。",
    "今天有 {block_count} 个时间块被认真度过 ✦"
  ],
  "stable_day": [
    "今天 {hours}h {minutes}min ✦ 本周日均 {avg_hours}h {avg_minutes}min",
    "{block_count} 个时间块挂着 todo，{free_count} 个自由"
  ],
  "low_productivity_day": [
    "今天 {hours}h {minutes}min。明天还有时间。",
    "{date} 的你专注了 {hours}h {minutes}min。"
  ],
  "first_day": [
    "欢迎来到 Peel。",
    "你正在做什么？"
  ],
  "streak_soft_mention": [
    "连续 {streak_days} 天在记录。"
  ],
  "pomodoro_completed": [
    "一个番茄完成 ✦ 25 分钟。",
    "🍅 + 1"
  ],
  "orange_rain_triggered": [
    "🍊 {minutes}min 已过。"
  ]
}
```

**规则**：

- 模板**用插值**填充数据（`{hours}` / `{minutes}` / `{date}` 等）
- 同一句**不连续两天复用**（pick 时记录历史）
- 全部**人工撰写**，不接 LLM API
- 每个场景 5-10 个模板，总计 30-50 个

---

*This PRD was drafted via a multi-day Claude Opus 4.7 brainstorm session (2026-05-06 → 2026-05-14). It is the foundation for Phase 2 implementation (Next.js + Tailwind + shadcn + Vitest). 任何条目都可在未来 sprint 中修订；重大变更须在 § 10 更新日志登记并 bump version。*
