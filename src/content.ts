/** Privacy policy copy — text is canon from the Figma "For Claude" frames. */

export const privacyEn = {
  paras1: [
    'Shiyun does not collect any user data.',
    'Shiyun runs entirely offline. The birth date and hour you enter are used only for calculations on your own device. Every result, from your Four Pillars chart to daily guidance and directional deities, is generated locally. Nothing is uploaded, transmitted, or sent to any server.',
    'Specifically:',
  ],
  bullets: [
    'No sign-up, no account system',
    'No collection of your name, gender, location, or other personal information',
    'No third-party analytics or ad tracking',
    'Your birth information stays on your device and is fully removed when you delete the app',
  ],
  paras2: [
    'Shiyun doesn’t share data with third parties, because there’s no data to share.',
    'If you have questions about this policy, you can reach us at hello@myshiyun.com',
  ],
};

export const privacyCn = {
  paras1: [
    '时运不会收集任何用户个人数据。',
    '时运是一款完全离线运行的应用。你输入的出生日期与时辰仅用于本地计算，所有排盘、宜忌、方位神位等推演结果均在你的设备本地生成，全程不会联网传输，不会上传、也不会发送至任何外部服务器。',
    '具体来说：',
  ],
  bullets: [
    '无需注册，无账号系统',
    '不会主动收集你的姓名、性别、地理位置等任何个人敏感信息',
    '不使用第三方分析或广告追踪工具',
    '你填写的出生时间信息仅保存在本机本地，卸载应用后该信息将被完全清除，无法恢复',
  ],
  paras2: [
    '时运不会与任何第三方共享你的个人数据——因为我们从始至终没有获取过你的相关数据，本就无数据可共享。',
    '如你对本政策有任何疑问，可通过 hello@myshiyun.com 联系我们。',
  ],
};

export const privacyUpdated = 'Last updated: Aug 20, 2026';

/** About page — four sections; a block with a `head` renders as 小标题 + body. */
export type AboutBlock = { head?: string; text: string };

export const aboutSections: {
  id: string;
  nav: string;
  titleCn: string;
  titleEn: string;
  en: AboutBlock[];
  cn: AboutBlock[];
}[] = [
  {
    id: 'the-app',
    nav: 'The App',
    titleCn: '时运',
    titleEn: 'The App',
    en: [
      { text: 'Shiyun is a free bilingual app that reads your birth chart to tell you which days and hours are favorable for you, based on the traditional Chinese calendar.' },
      { head: 'Daily reading', text: 'Each day carries one of the Five Elements. How it interacts with your core element decides whether the day runs Clear, Mild, or Turbulent for you, with guidance written for that exact combination.' },
      { head: 'Hourly tiers', text: 'The twelve traditional hours of the day each rise and fall differently for you. Shiyun marks them Flowing, Still, or Friction, so you know how each hour sits with your chart.' },
      { head: 'Personalized do’s and don’ts', text: 'The almanac’s classic activity guidance, filtered through your chart. Not one list for everyone. Yours.' },
      { head: 'Directional deities', text: 'Wealth, fortune, and joy each reside in a different direction every day. Open the live compass and see where they sit from where you stand.' },
      { head: 'Day search', text: 'Planning ahead? Set a date range and Shiyun filters it against your chart, surfacing the days that align with you.' },
      { head: 'Your chart', text: 'Your Four Pillars, core element, and zodiac sign, laid out in one place.' },
    ],
    cn: [
      { text: '时运是一款免费双语App，以传统中国历法智慧为依据，结合你的专属生辰八字，分别为你呈现每日整体行运状态参考与当日各时辰的行事指引。' },
      { head: '今日运势', text: '当日天干五行与你日主的生克关系，决定这一天对你而言的气场吉凶。逐日生成的专属断语，配合黄道十二神与生肖冲煞，给你当天的整体参照。' },
      { head: '时辰吉凶', text: '一天十二时辰，各有气场起伏。时运按你的八字逐时推算，标注出吉时、平随时与需谨慎的时段，帮你挑对做事的时机。' },
      { head: '每日宜忌', text: '结合你的命盘筛选当日宜忌事项，不再是所有人共用同一份通用宜忌，而是完全为你定制的专属版本。' },
      { head: '方位神', text: '财神、福神、喜神，每日所在方位不同。打开罗盘，实时对照当下朝向。' },
      { head: '吉日查询', text: '如果想找一个适合你的日子，输入日期范围，时运按你的命盘筛选出该时间段内对你而言气场适配的吉日，提前安排，心中有数。' },
      { head: '个人命盘', text: '你的四柱、日主、生肖与五行格局，一目了然。' },
    ],
  },
  {
    id: 'our-story',
    nav: 'Our Story',
    titleCn: '时运起源',
    titleEn: 'Our Story',
    en: [
      { text: 'For over a thousand years, the Chinese almanac has given time its texture. When to build, when to marry, when to begin a journey.' },
      { text: 'But for centuries, the almanac on the wall came in one version. One book, one verdict, written for everyone and no one in particular. In the original system, a day’s character was never absolute. It always depended on who was asking.' },
      { text: 'Shiyun restores that lost half of the tradition. Enter your birth moment once, and the almanac recalculates around you. The same date can read Clear for one person and Turbulent for another. This is how it was always meant to work.' },
      { text: 'Whether you grew up with an almanac in the house or are just now discovering the system, Shiyun reads it for you, in both languages, side by side.' },
    ],
    cn: [
      { text: '老墙上的黄历，一页页撕了上千年。盖房要选动土日，成亲要挑嫁娶期，出远门前总要先翻一翻——中国人的日子，早就在这一页页黄历里，分出了轻重缓急。' },
      { text: '可千年来，家家户户贴的黄历，永远是同一本。同样的宜忌，贴在每一面墙上，说给每一个人听。但老祖宗传下来的道理里，日子的吉凶从来就不是死的：同一个日子，落在不同的人身上，本就该有不同的注解。' },
      { text: '时运把这失落了太久的一半传统找了回来：输入你的生辰，整本黄历就会围着你的专属八字重新推演。同一天，有人宜出行开张，有人宜安身静守，有人遇吉，有人避凶，这才是传统最原本的样子。' },
      { text: '不管你是从小跟着长辈翻黄历长大，还是第一次对这套东方时间智慧生出兴趣，时运都会把独属于你的那份时间答案，好好算给你看。' },
    ],
  },
  {
    id: 'calculation',
    nav: 'Calculation',
    titleCn: '计算方式',
    titleEn: 'The Calculation',
    en: [
      { text: 'A traditional almanac gives everyone the same reading. Shiyun doesn’t.' },
      { text: 'When you set up your profile, you enter your birth date and hour. From these, Shiyun derives your Four Pillars: your birth chart in the Chinese tradition, a unique coordinate in time that belongs only to you.' },
      { text: 'At the heart of your chart is your day master: your elemental identity. It defines whether you are Wood, Fire, Earth, Metal, or Water, and how you relate to the energy of each passing day.' },
      { text: 'Shiyun reads each day’s element against your day master. A day whose element nourishes yours reads as favorable. A day that works against it calls for care. A day that clashes with your zodiac sign says: save the big moves for later.' },
      { text: 'Shiyun goes one level deeper than the day. Tradition divides each day into twelve two-hour periods, and each period carries its own element. The day is not twelve equal slices. It is twelve distinct qualities of time. Shiyun applies the same method one level down: each period’s element is read against your day master, and each period is weighed against the character of the day itself. Together, these tell you how the hour sits with you. Even within a single day, there is a time to act and a time to be still.' },
      { text: 'Every reading you see is calculated this way, for you alone. All calculations happen locally on your device. Your birth information never leaves your phone.' },
    ],
    cn: [
      { text: '传统黄历人人相同，时运却因人而异。' },
      { text: '创建档案时，你输入出生日期与时辰，时运会据此为你排出专属四柱：年柱、月柱、日柱、时柱，每柱各由一个天干搭配一个地支组成，四柱共八个字，合起来就是我们俗称的「生辰八字」—— 这是传统命理为每个人建立的独一无二的时间坐标。' },
      { text: '八字之中，出生日的天干被称为日主，代表你的命理本位。你自身的五行属性，以及和每一天的气场如何相生相克，都以日主为核心推演而来。' },
      { text: '时运每天都会把当日的天干五行与你的日主对照：五行相生则当日气场多吉，行事更易顺遂；五行相克则需多加谨慎，稳妥规避风险。当日的地支也会纳入推演：如果和你的生肖地支相冲，重要事宜便建议改期择吉。' },
      { text: '日之下，还有更精细的十二时辰。传统命理将一天划分为十二时辰，每个时辰都有自己专属的干支五行。它并非把一天均匀切分，而是对应着十二段属性各不相同的天地之气。时运会再做一层专属推演：将每个时辰的五行与你的日主对照，相生则气场顺畅，相克则行事易有阻滞，同时还会核验这个时辰与当日干支的合冲关系。两层逻辑叠加对照，最终得出的就是你在这个时辰的专属气场状态。所以哪怕是同一天，也有适配行动的吉时，和更适合静守蓄力的时段。' },
      { text: '你在时运里看到的每一条宜忌、每一段文字，都是完全为你一个人定制推演的。所有计算都在你的手机本地完成，你的生辰隐私信息，绝不会上传到任何外部服务器。' },
    ],
  },
  {
    id: 'credit',
    nav: 'Credit',
    titleCn: '幕后名录',
    titleEn: 'Credit',
    en: [
      { text: 'Shiyun is designed and built by designer Zheng Jian, who goes by Bill Chien. The calendar numerals are set in Brice Black, a typeface by Indonesian graphic designer Cahya Sofyan, who generously let me use it in Shiyun.' },
    ],
    cn: [
      { text: '时运由设计师 [Bill Chien] 一人设计与开发。日历上的大数字使用 Brice Black，由印度尼西亚平面设计师 [Cahya Sofyan] 设计。感谢他慷慨允许时运使用这套字体。' },
    ],
  },
];

/** Learn tab placeholder, centred on screen until the guides land. */
export const learnSoon = {
  cn: '中国历法内容制作中',
  en: 'Guides to the Chinese calendar coming soon',
};

/** The credit section's underlined names — targets to fill in when decided. */
export const creditLinks: Record<string, string> = {
  'Bill Chien': 'https://www.billchien.net',
  'Cahya Sofyan': 'https://www.behance.net/cahyasofyan?locale=en_US',
};
