import type { Dict } from "./index";

/** Simplified Chinese. */
export const zh: Dict = {
  nav: {
    platform: "平台",
    solutions: "解决方案",
    tactics: "战术",
    proof: "证据",
    marketplace: "市场",
  },
  header: {
    athletes: "运动员",
    signIn: "登录",
    bookDemo: "预约演示",
  },
  lang: {
    label: "语言",
  },
  footer: {
    tagline:
      "面向足球的效度验证型状态智能 —— 每位运动员每天一个分数，始终可解释、受同意治理。由 Healthmetryx 构建。",
    product: "产品",
    getStarted: "开始使用",
    trust: "信任与法律",
    pilot: "试点计划",
    guest: "以访客身份继续",
    demo: "预约演示",
    changelog: "更新日志",
    privacy: "隐私",
    terms: "条款",
    pilotCta: "加入试点",
    chip: "合成演示",
    disclaimer: "仅作决策支持 · 非医疗器械",
    copyright: "© 2026 Healthmetryx · Sportmetryx Football",
  },
  home: {
    hero: {
      eyebrow: "面向足球表现团队的决策支持",
      h1a: "把每日运动员数据变成",
      h1b: "你能为之辩护的决策。",
      ledeStrong: "Sportmetryx Football",
      ledeRest:
        "将你的团队已在收集的数据 —— GPS、训练负荷、健康状态、环境 —— 转化为每位运动员每日一个状态分数：先做效度检查，基于个人基线，始终可解释。",
      btnDemo: "预约演示",
      btnGuest: "以访客身份继续",
      btnPlatform: "查看平台",
      guestNote: "访客模式以标注的合成数据展示所有页面 —— 无需注册。",
    },
    proofLabels: [
      "覆盖运动项目",
      "已处理设备观测",
      "端到端建模训练",
      "在线部署",
    ],
    solutions: {
      eyebrow: "解决方案",
      h2: "会议桌上的四个席位。一个数据模型。",
      explore: "探索解决方案 →",
      cards: [
        {
          title: "状态与表现",
          body: "在全团队信赖的同一块看板上，训练开始前就知道谁能练、练到什么强度。",
        },
        {
          title: "医疗与康复",
          body: "尽早发现 COMPROMISED 信号，把 WITHHELD 数据挡在画面之外，并以审计链记录回归过程。",
        },
        {
          title: "教练与发展",
          body: "带着上下文选择、轮换与休息 —— 用阵容对比和14天趋势替代直觉。",
        },
        {
          title: "数据产品与研究",
          body: "通过内置市场打包并授权受同意治理的数据集 —— 为已有数据开辟收入渠道。",
        },
      ],
    },
    what: {
      eyebrow: "它是什么",
      h2: "一层状态智能 —— 而不是又一个仪表盘。",
      p1: "Sportmetryx 把足球组织已有的零散导出 —— 传感器文件、健康表单、负荷报告 —— 统一为一份**合并的运动员-日记录**：每位运动员每天一行，并由此得出状态分数。",
      p2: "每个分数都经过**效度验证**（错误或缺失的输入会被标记，绝不静默计分）、**可解释**（你总能看到是哪些驱动因素改变了数字）且**受同意治理**（运动员数据只在其同意的访问控制下可见）。",
      p3: "其结果是一幅共享、可审计的画面，整个团队都能在每次训练前据此行动。",
      glanceTitle: "概览",
      glance: [
        { label: "领域", value: "足球运动表现" },
        { label: "构建者", value: "Healthmetryx" },
        { label: "分数", value: "效度验证、可解释" },
        { label: "基线", value: "个人化，按运动员" },
        { label: "数据", value: "合成演示 —— 非真实运动员" },
        { label: "状态", value: "原型 · 研究与演示" },
      ],
    },
    who: {
      eyebrow: "为谁而建",
      h2: "一个平台，闭环中的每个角色。",
      cards: [
        { title: "表现团队", line: "一屏掌握每日训练画面。" },
        { title: "医疗与康复", line: "尽早发现 COMPROMISED 信号，验证回归。" },
        { title: "教练", line: "用状态上下文选人，而非仅凭直觉。" },
        { title: "分析师与研究员", line: "使用效度验证、受同意治理的数据集。" },
      ],
    },
    usecases: {
      eyebrow: "用例",
      h2: "它被用来做什么",
      cards: [
        {
          title: "每日状态决策",
          body: "训练开始前看到谁是 READY、MONITOR 或 COMPROMISED —— 每个等级背后的驱动因素一目了然，不是黑箱数字。",
        },
        {
          title: "负荷与环境",
          body: "对照每位运动员自身的基线追踪每日负荷、出行与高温暴露，上下文永不丢失。",
        },
        {
          title: "阵容与轮换规划",
          body: "对比全队状态，自信地规划出场时间、轮换与恢复日。",
        },
        {
          title: "数据产品与研究",
          body: "在市场中打包授权衍生数据集 —— 仅演示结账，无真实付款。",
        },
      ],
    },
    watch: {
      eyebrow: "观看",
      h2: "观看产品导览",
      lede: "一张片头加五个章节 —— 总览、运动员看板、Player 360、市场、治理。点击播放，或跳到任意章节。把真实录屏放入 **public/demo.mp4**，播放器会自动切换。",
    },
    tour: {
      eyebrow: "工作原理",
      h2: "导入。校验。决策。",
      sub: "点开流程看一遍 —— 或让它自动播放。",
    },
    sports: [
      "足球",
      "美式足球",
      "篮球",
      "棒球",
      "自行车",
      "橄榄球",
      "田径",
      "排球",
    ],
    data: {
      eyebrow: "数据",
      h2: "探索演示数据集",
      lede: "本演示运行的完整数据 —— 50名合成运动员、每日传感器均值、负荷、环境、同意、基线与分数。",
      download: "下载完整 CSV",
      stats: ["运动员-日行数", "运动员", "球队", "覆盖天数"],
      distTitle: "状态分布（已计分日）",
      range: "区间",
      teams: "球队",
      headers: ["运动员", "日期", "球队", "位置", "分数", "等级"],
      note: "前6行预览。完整文件包含所有传感器均值、驱动因素贡献与效度检查 —— 明确标注的合成数据，非真实运动员。",
    },
    tactics: {
      eyebrow: "全新 · 战术智能",
      h2: "阵型、阶段与比赛体系，尽在3D战术板。",
      lede: "状态回答谁能上场 —— 战术回答我们怎么踢。切换阵型，看传球线路自己画出来，运行执教演练。",
      btn: "探索战术 →",
    },
    cta: {
      h2: "带着你的问题，看它运行。",
      lede: "三十分钟，真实产品，无幻灯片 —— 五个页面、你的数据问题，以及一个试点赛季是什么样。",
      btnProof: "查看证据",
    },
  },
  nf: {
    eyebrow: "404 · 出界了",
    h1: "页面未找到。",
    lede: "链接已失效或页面已移动。每位运动员都在该在的位置 —— 这一个不在。",
    btnHome: "返回首页",
    btnMarket: "打开市场",
    btnGuest: "以访客身份继续",
    note: "仅作决策支持。非医疗器械。© Sportmetryx",
  },
};
