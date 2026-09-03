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
    'You can reach us by email through the feedback option in the app. Sending an email is entirely your choice, and it goes through your own mail app. Shiyun never reads or stores your messages. Anything you include in an email, such as your email address, is used only to respond to you and for nothing else.',
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
    '不会收集你的姓名、性别、地理位置等任何个人敏感信息',
    '不使用第三方分析或广告追踪工具',
    '你填写的出生时间信息仅保存在本机本地，卸载应用后该信息将被完全清除，无法恢复',
  ],
  paras2: [
    '时运不会与任何第三方共享你的个人数据，因为我们从始至终没有获取过你的相关数据，本就无数据可共享。',
    '你可以通过App内的反馈入口给我们发邮件。发或不发，完全由你决定。邮件从你自己的邮件应用发出，时运不会读取、存储你的任何邮件信息。你在邮件里提供的内容，包括你的邮箱地址，仅用于回复你的反馈，不会挪作他用。',
    '如你对本政策有任何疑问，可通过 hello@myshiyun.com 联系我们。',
  ],
};

/**
 * The policy's own date — bump BOTH lines when the text above actually
 * changes. It used to be stamped from the build clock, which re-dated the
 * page on every deploy and told readers a change had been made when none had.
 */
export const privacyUpdated = 'Last updated: Aug 26, 2026';
export const privacyUpdatedCn = '更新日期: 2026年8月26日';

/** Single-language mode — the top nav's labels per language (Figma CN/EN). */
export const navLabels: Record<'en' | 'cn', Record<string, string>> = {
  en: { about: 'About', learn: 'Learn', support: 'Support', privacy: 'Privacy' },
  cn: { about: '故事', learn: '学习', support: '帮助', privacy: '隐私' },
};

/** About page — four sections; a block with a `head` renders as 小标题 + body. */
export type AboutBlock = { head?: string; text: string };

export const aboutSections: {
  id: string;
  nav: string;
  navCn: string;
  titleCn: string;
  titleEn: string;
  en: AboutBlock[];
  cn: AboutBlock[];
}[] = [
  {
    id: 'the-app',
    nav: 'The App',
    navCn: '时运',
    titleCn: '时运',
    titleEn: 'The App',
    en: [
      { text: 'Shiyun is a free bilingual app that reads your birth chart to tell you which days and hours are favorable for you, based on the traditional Chinese calendar.' },
      { head: 'Daily reading', text: 'Each day carries one of the Five Elements. How it interacts with your core element decides whether the day runs Clear, Mild, or Turbulent for you, with guidance written for that exact combination.' },
      { head: 'Hourly tiers', text: 'The twelve traditional hours of the day each rise and fall differently for you. Shiyun marks them Flowing, Still, or Friction, so you know how each hour sits with your chart.' },
      { head: 'What the day favors', text: 'The almanac’s classic guidance on what suits a day and what doesn’t: weddings, moving, opening a business, travel. Drawn from the day itself, ordered to sit closest to your chart.' },
      { head: 'Directions of the day', text: 'Wealth, fortune, and joy each rest in a different direction every day. Open the live compass and see where they sit from where you stand.' },
      { head: 'Day search', text: 'Have something planned? Pick the occasion — a wedding, a move, opening a business — set a range of months, and Shiyun finds the days the almanac favors for it, keeping only those that don’t run turbulent for you.' },
      { head: 'Your chart', text: 'Your Four Pillars, core element, and zodiac sign, laid out in one place.' },
    ],
    cn: [
      { text: '时运是一款免费双语App，以传统中国历法智慧为依据，结合你的专属生辰八字，分别为你呈现每日整体行运状态参考与当日各时辰的行事指引。' },
      { head: '今日运势', text: '当日天干五行与你日主的生克关系，决定这一天对你而言的气场吉凶。逐日生成的专属断语，配合黄道十二神与生肖冲煞，给你当天的整体参照。' },
      { head: '时辰吉凶', text: '一天十二时辰，各有气场起伏。时运按你的八字逐时推算，标注出吉时、平随时与需谨慎的时段，帮你挑对做事的时机。' },
      { head: '每日宜忌', text: '承接传统黄历宜忌体系，重要事项提前参考，条目按你的专属节律优先展示。' },
      { head: '方位神', text: '财神、福神、喜神，每日所在方位不同。打开罗盘，实时对照当下朝向。' },
      { head: '吉日查询', text: '如果想找一个适合你的日子，输入日期范围，时运按你的命盘筛选出该时间段内对你而言气场适配的吉日，提前安排，心中有数。' },
      { head: '个人命盘', text: '你的四柱、日主、生肖与五行格局，一目了然。' },
    ],
  },
  {
    id: 'our-story',
    nav: 'Our Story',
    navCn: '起源',
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
    navCn: '算法',
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
    navCn: '名录',
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

/** Support tab — FAQ. Q&A pairs share the About block shape (head + body);
 *  the closing line has no head and carries the mailto. */
export const supportFaq: { en: AboutBlock[]; cn: AboutBlock[] } = {
  en: [
    {
      head: 'I didn’t enter my birth hour. Does that matter?',
      text: 'It does. Without the hour, Shiyun calculates from three pillars instead of four. The results still hold, just with less precision. You can add your hour anytime on your profile page.',
    },
    {
      head: 'Is my birth information safe?',
      text: 'Absolutely. Nothing is uploaded or transmitted when you enter your birth information. It stays only on your device and deleting the app removes it completely.',
    },
    {
      head: 'How do I change my birth information?',
      text: 'Open your profile page and tap Birthday in the menu.',
    },
    { text: 'For anything else, email us at hello@myshiyun.com and we’ll get back to you soon.' },
  ],
  cn: [
    {
      head: '没填出生时辰会影响结果吗?',
      text: '会的哦。未填时辰时，时运以三柱推算，结果依然有效，但精度不及四柱完整。你可以随时在个人页补填。',
    },
    {
      head: '我的出生信息安全吗?',
      text: '非常安全。你的出生信息只保存在本机，不上传、不联网。卸载应用即完全清除，无法恢复。',
    },
    {
      head: '如何修改出生信息?',
      text: '进入我的Profile，在菜单里选择「生日」即可。',
    },
    { text: '其他问题或建议，请发邮件至时运邮箱 hello@myshiyun.com，我们会尽快回复。' },
  ],
};

/**
 * Learn page — text canon lives in MDs/shiyun_learn_concepts.md; the block
 * layout (what sits before or after a figure) follows the Figma frames.
 * A block is one of: paragraph (`\n` renders as <br>), small display title,
 * or a figure by name ('taiji' — the photo; 'elements' — the coded graph).
 */
export type LearnBlock = { p?: string; sub?: string; fig?: 'taiji' | 'elements' };

export const learnIntro = {
  sentenceEn: 'Every reading in Shiyun draws on systems formed over three thousand years of Chinese civilization.',
  sentenceCn: '你在时运里的每一条推算，\n都源自中华文明的积累。',
  en: [
    'Day counting by stems and branches goes back to the Shang dynasty. The Five Elements were systematized in the Warring States period. The Four Pillars method was codified in the Tang and Song. Every tier and every reading you see is these systems interlocking, computed the way they have been for centuries.',
    'This page takes the concepts one at a time: yin and yang first, then the Five Elements, the stems and branches, the calendar itself, and finally the Four Pillars that belong to you alone. There’s no rush. Take it at your own pace.',
  ],
  cn: [
    '干支纪日始于商代，五行体系完善于战国，四柱之法定于唐宋。你看到的每一个吉凶档位、每一条宜忌，背后都是这几套传统体系层层咬合、共同推演的结果。',
    '这一页，我们把这些底层概念逐个讲清：从最基础的阴阳起步，依次理清五行、干支、历法，最终落到专属于你的个人四柱。不必一次读完，按自己的节奏，慢慢品味。',
  ],
};

export const learnSections: {
  id: string;
  nav: string;
  navCn: string;
  titleEn: string;
  titleCn: string;
  en: LearnBlock[];
  cn: LearnBlock[];
}[] = [
  {
    id: 'yin-yang',
    nav: 'Yin Yang',
    navCn: '阴阳',
    titleEn: 'Yin & Yang',
    titleCn: '阴阳',
    en: [
      { p: 'One of the oldest ideas in Chinese philosophy, drawn from watching nature: sun and moon, day and night, motion and stillness. The characters themselves began as landscape. Yin is the shaded side of a hill, yang the sunlit side.' },
      { fig: 'taiji' },
      { p: 'The idea was worked out in the commentaries to the I Ching, the Book of Changes. Its insight is simple: everything has two opposing sides, yet yin and yang are not enemies but partners, each depending on the other, each turning into the other in an endless cycle. Day rolls into night, night into day. Neither exists alone.' },
      { p: 'In the Chinese calendar, yin and yang are the ground floor. Every heavenly stem, every earthly branch, every element carries a yin or yang charge. Everything that follows builds on this pair.' },
    ],
    cn: [
      { p: '阴阳，是中国最古老的哲学观念之一。' },
      { p: '源于古人对自然的观察：日月、昼夜、动静，都是最直观的阴阳原型。「阴」「阳」二字的本义，就是山的背阴面与向阳面。' },
      { fig: 'taiji' },
      { p: '《易经》的传注把这一思想说透：万物都有对立两面，但阴阳并非彼此为敌，而是相互依存、相互转化，循环不止。阳极生阴，阴极生阳，没有哪一面能独存。' },
      { p: '在历法与命理里，阴阳是最底层的分类：天干地支各分阴阳，五行也各分阴阳。读懂阴阳，才读得懂后面的一切。' },
    ],
  },
  {
    id: 'five-elements',
    nav: 'Five Elements',
    navCn: '五行',
    titleEn: 'The Five Elements',
    titleCn: '五行',
    en: [
      { p: 'Wood, Fire, Earth, Metal, Water. Despite the name, these are not building blocks like the Greek four elements. The earliest definition, in the Book of Documents some three thousand years ago, describes them as behaviors: water soaks downward, fire flares upward, wood bends and straightens, metal yields and reshapes, earth takes seed and gives harvest. Think verbs, not substances.' },
      { fig: 'elements' },
      { p: 'In the Warring States period, the philosopher Zou Yan used their cycle of conquest to explain the rise and fall of dynasties. By the Han dynasty, the five ran through everything: medicine, music, and the calendar itself.' },
      { p: 'They relate in two cycles. In the generating cycle, each feeds the next: Wood fuels Fire, Fire makes Earth, Earth bears Metal, Metal carries Water, Water nourishes Wood. In the overcoming cycle, each keeps another in check: Water quenches Fire, Fire melts Metal, Metal cuts Wood, Wood breaks Earth, Earth dams Water. Overcoming is not destruction. It is restraint, and a healthy system needs both.' },
    ],
    cn: [
      { p: '五行，就是木、火、土、金、水。' },
      { p: '五行的说法，最早出现在《尚书·洪范》里，商末周初就已经成文。原文写着：「水曰润下，火曰炎上，木曰曲直，金曰从革，土爰稼穑。」这里说的不是五种具体东西，是五种不同的性状：水向下浸润，火向上升腾，木能弯也能直，金可熔可铸，土能种能收。' },
      { fig: 'elements' },
      { p: '战国时邹衍用五行相胜的逻辑，推演朝代更替。汉代之后，五行成了古人解释万物的主流框架，历法、医学、音律，全在用这套道理。' },
      { p: '五行之间有两条核心脉络：\n一条是相生：木生火、火生土、土生金、金生水、水生木，环环滋养。\n一条是相克：木克土、土克水、水克火、火克金、金克木，彼此约束。\n「克」不是毁灭，只是约束。只有生没有克，状态就会失衡；只有克没有生，能量就会枯竭。生克同时存在，才是最自然的常态。' },
    ],
  },
  {
    id: 'stems-branches',
    nav: 'Stems & Branches',
    navCn: '天干地支',
    titleEn: 'Heavenly Stems & Earthly Branches',
    titleCn: '天干地支',
    en: [
      { p: 'Two sets of counting signs, invented in ancient China to mark time. Their earliest traces are on Shang dynasty oracle bones, over three thousand years old, where they were used to count the days. The count has never stopped.' },
      { p: 'There are ten Heavenly Stems and twelve Earthly Branches.' },
      { p: 'They pair by turning in step, like two wheels: first stem with first branch, second with second, and on they roll. The stems run out at ten and start over; the branches reset at twelve. The wheels only return to their starting point together after sixty pairs, the least common multiple of ten and twelve. Sixty pairs, no repeats, then round again: the sixty-pair cycle. These are the day names the Shang carved into bone, one pair per day, sixty days per round.' },
    ],
    cn: [
      { p: '天干地支，是中国古人发明的一套计时符号，两组互相配合，构成了中华文明的时间坐标。' },
      { p: '最早的记录见于商代甲骨文，当时就用来纪日，三千多年从来没有间断过。' },
      { p: '天干一共十个：甲、乙、丙、丁、戊、己、庚、辛、壬、癸；\n地支一共十二个：子、丑、寅、卯、辰、巳、午、未、申、酉、戌、亥。' },
      { p: '两者的配合方式是两组同步轮转：甲配子为「甲子」，乙配丑为「乙丑」，顺着次序往下排。天干十个用完就从头再来，地支十二个转完也从头再来，两个轮子各自按自己的节奏转，要到第六十对才会同时回到起点。' },
      { p: '十和十二的最小公倍数，刚好就是六十。从甲子排到癸亥，六十对完全不重复，转完就从头再来，这就是大家熟悉的「六十甲子」。商代人纪日用的正是这套规则，一天一对，六十天一轮。' },
    ],
  },
  {
    id: 'zodiac',
    nav: 'Chinese Zodiac',
    navCn: '生肖',
    titleEn: 'The Chinese Zodiac',
    titleCn: '生肖',
    en: [
      { p: 'Rat, Ox, Tiger, Rabbit, Dragon, Snake, Horse, Goat, Monkey, Rooster, Dog, Pig.' },
      { p: 'The twelve animals are the faces of the twelve Earthly Branches: one animal per branch. The pairing gave abstract signs something anyone could remember. You may forget the third branch; you won’t forget the Tiger.' },
      { p: 'The earliest record of the pairing is on bamboo slips from the late Warring States period. By the Han dynasty the set had settled into today’s twelve, and it hasn’t changed in two thousand years.' },
    ],
    cn: [
      { p: '就是鼠、牛、虎、兔、龙、蛇、马、羊、猴、鸡、狗、猪。' },
      { p: '生肖是十二地支的形象化身：子鼠、丑牛、寅虎，一个地支配一个动物。抽象的符号有了具体面孔，哪怕谁记不住「寅」这个字，也肯定记得住对应的「虎」。' },
      { p: '这套地支和生肖的配对，最早的实物记录见于战国晚期的秦简，到东汉就完全定型成今天我们熟悉的十二种，之后两千多年再也没有改动过。' },
    ],
  },
  {
    id: 'twelve-hours',
    nav: 'Twelve Hours',
    navCn: '时辰',
    titleEn: 'The Twelve Hours',
    titleCn: '时辰',
    en: [
      { p: 'The traditional Chinese day divides into twelve segments of two hours each.' },
      { p: 'At first, each stretch carried a name drawn from sky and daily routine: Midnight, Rooster’s Crow, Daybreak, Sunrise, Meal Time, High Noon, Dusk, Settling In. Every name is a little picture of daily life.' },
      { p: 'Under the Han dynasty, the system was fixed: the day splits into twelve equal parts, counted by the Earthly Branches, starting at 11 p.m. and changing every two hours. The two sets of names have run side by side ever since.' },
      { p: 'Twelve hours, end to end, around and around.' },
    ],
    cn: [
      { p: '古人把一昼夜分成十二段，每段两小时，就叫一个时辰。' },
      { p: '最开始是按天色和日常作息给时段起名：夜半、鸡鸣、平旦、日出、食时、日中、黄昏、人定，每个名字都是一幅鲜活的生活图景。' },
      { p: '到了汉代，把一天十二等分、用地支来纪时的制度正式定型：夜里十一点到凌晨一点为子时，顺着地支次序每两小时换一个时辰，两套名字从此并行通用。子时就是夜半，卯时就是日出，午时就是日中。' },
      { p: '一天十二时辰，首尾相接，循环不息。' },
    ],
  },
  {
    id: 'calendar',
    nav: 'Chinese Calendar',
    navCn: '中国历法',
    titleEn: 'The Chinese Calendar',
    titleCn: '中国历法',
    en: [
      { p: 'You’ll often hear it called the “Chinese lunar calendar.” That name is wrong, and the error hides the system’s real elegance. The Chinese calendar is lunisolar: months follow the moon, years follow the sun, and the whole design is a negotiation between the two.' },
      { p: 'One lunar cycle, new moon to new moon, takes about 29.5 days. So calendar months alternate between 29 and 30 days, and every month begins on a new moon, with the full moon landing mid-month. Twelve such months add up to about 354 days, 11 days short of the solar year. Left alone, the drift would compound and New Year would wander into summer. The ancient solution is the leap month: every two or three years, one extra month is inserted, giving that year thirteen. The moon keeps the months, the sun keeps the years, and the leap month keeps the peace.' },
      { p: 'The sun’s own rhythm is marked by the 24 solar terms, one for every 15 degrees the sun travels along its path: Start of Spring, Summer Solstice, Frost’s Descent, Winter Solstice. Farmers worked by these, not by the months, because planting answers to the sun.' },
      { p: 'The system has been refined dynasty after dynasty since the Shang, and it has never stopped running.' },
    ],
    cn: [
      { p: '中国传统历法是一部阴阳合历：月随月亮，年随太阳，两套节律并行，缺一不可。' },
      { p: '月亮圆缺一轮约二十九天半，所以历法里的月，大月三十天，小月二十九天，初一必为朔日，十五前后必为望日。十二个月加起来约三百五十四天，比太阳年少十一天。如果放任这个差值累积，年年叠加之后，新年会一路偏移到夏天。古人的解决办法叫「置闰」：每两三年补进一个闰月，那一年便有十三个月。月份随月亮节律走，年岁随太阳节律走，始终把误差拉回可控范围。' },
      { p: '太阳的节律，则交给二十四节气：太阳在黄道上每走十五度就设一个节气，立春、夏至、霜降、冬至，全是太阳的脚步，和月亮完全无关。农事只看节气，不看月份，因为播种收割认的是太阳的冷暖节奏。' },
      { p: '这套历法从商代甲骨历起步，历代不断修订精化，一直沿用至今。' },
    ],
  },
  {
    id: 'convergence',
    nav: 'System Convergence',
    navCn: '系统融合',
    titleEn: 'System Convergence',
    titleCn: '系统融合',
    en: [
      { p: 'Yin and yang, the Five Elements, the stems and branches: each began as a system of its own.' },
      { p: 'Toward the end of the Warring States period, yin-yang and the Five Elements merged, and scholars used the pair to explain everything from the turning seasons to the rise and fall of dynasties. Under the Han, the framework spread wider still, and the stems and branches were drawn in, layer binding to layer. Each layer gave the signs another level of meaning.' },
      { p: 'And once every system locked together, time, which had only ever been a measure, took on a character of its own.' },
      { sub: 'Yin-Yang  ×  Stems & Branches' },
      { p: 'Every stem and every branch takes a charge, alternating yang and yin down each list. Odd positions are yang, even positions are yin.' },
      { p: 'Now look back at the sixty-pair cycle. Because both wheels start together and move in step, odd always lands on odd: a yang stem only ever meets a yang branch, a yin stem only a yin branch. All sixty pairs, no exceptions.' },
      { sub: 'Yin-Yang  ×  the Five Elements' },
      { p: 'Each of the five elements splits in two: a yang side that reaches outward, a yin side that gathers within. Five times two, ten states.' },
      { p: 'Yang Wood is the towering tree; yin Wood, the flowering vine. Yang Fire is the blazing sun; yin Fire, the warm lamp. Yang Earth is the mountain; yin Earth, the field. Yang Metal is the axe; yin Metal, the jewel. Yang Water is the river; yin Water, the morning dew.' },
      { p: 'Neither side outranks the other. Timber builds the house, vines bear the flowers; the sun drives growth, the lamp lights the night. Ten states draw the world in finer strokes than five.' },
      { sub: 'The Five Elements  ×  Stems & Branches' },
      { p: 'Five elements, each split yang and yin: ten states, and exactly ten stems to carry them. The first two stems are yang and yin Wood, the next two yang and yin Fire, then Earth, Metal, Water, two by two down the list. The towering tree, the flowering vine, the sun, the lamp, the mountain, the field, the axe, the jewel, the river, the dew: ten signs, ten temperaments.' },
      { p: 'The branches take their elements from the seasons. They were the month-markers of the old calendar: twelve branches, twelve months, three to a season. Spring is when wood grows, so its branches belong to Wood; summer blazes, so Fire; autumn cuts and clears, so Metal; winter runs cold, so Water. The last month of each season, four in all, is the turning between seasons, and turning ground belongs to Earth.' },
      { p: 'So every stem-branch pair becomes a particular meeting of forces: the first pair joins yang Wood with a Water branch; another joins yang Fire with a Fire branch. Sixty pairs, sixty different tempers. Whichever pair the day lands on, that is the day’s disposition. Time, which had only ever been a measure, now has character.' },
      { p: 'The layers are now all in place. Every stem-branch pair carries a charge, an element, an image. One question remains: what do they have to do with you?' },
    ],
    cn: [
      { p: '阴阳、五行、干支，最开始都是各自独立的系统。' },
      { p: '战国末年，阴阳与五行合流：齐国的邹衍把五行相胜推到极致，用来解释王朝更替，这套理论叫「五德终始」，阴阳家也由此得名。《吕氏春秋·十二纪》《礼记·月令》把四时、五方、五色和五行拼成一张对应大表；到了西汉，经董仲舒等儒者与《淮南子》推演铺开，这套体系成了通行的宇宙解释框架，干支也在这个阶段被纳入进来，几大系统层层绑定。' },
      { p: '每结合一层，符号就多一层含义。等所有环节完全咬合，原本只是客观刻度的时间，就有了独属于自己的性格。' },
      { sub: '阴阳 × 干支' },
      { p: '阴阳与干支的结合，是干支获得的第一层属性。干支按次序，奇数位属阳，偶数位属阴。' },
      { p: '十天干里，甲、丙、戊、庚、壬是阳干，乙、丁、己、辛、癸是阴干；\n十二地支里，子、寅、辰、午、申、戌是阳支，丑、卯、巳、未、酉、亥是阴支。' },
      { p: '回头看六十甲子的配对，会发现一个天然形成的秩序：天干地支两轮同步起步，奇数位永远对上奇数位，所以阳干只会配阳支，阴干只会配阴支，六十组配对没有任何例外。' },
      { sub: '阴阳 × 五行' },
      { p: '五行各分阴阳，五乘二，刚好十种细分状态。同属一种五行，阳的一面取其向外舒展的气势，阴的一面取其向内凝聚的质地。' },
      { p: '同样是木：阳木像参天的乔木，阴木像柔软的花草枝蔓；\n同样是火：阳火像普照大地的烈日，阴火像温暖安静的灯烛；\n同样是土：阳土像厚重稳固的山岳，阴土像滋养作物的田园；\n同样是金：阳金像锋利坚硬的刀斧，阴金像温润精致的珠玉；\n同样是水：阳水像奔涌向前的江河，阴水像细密浸润的雨露。' },
      { p: '气势和质地没有高低之分，各有各的用处：乔木能做房梁，枝蔓能开花结果；烈日能催生万物，烛火能照亮夜晚。这十种细分状态，把世间万物的特质描摹得比五行本身更精细。' },
      { sub: '五行 × 干支' },
      { p: '五行阴阳的十种状态，刚好与十个天干一一匹配：甲是阳木，乙是阴木；丙是阳火，丁是阴火；戊是阳土，己是阴土；庚是阳金，辛是阴金；壬是阳水，癸是阴水。至此，乔木、枝蔓、烈日、灯烛、山岳、田园、刀斧、珠玉、江河、雨露，十个天干字，披上了十种完全不同的气质。' },
      { p: '十二地支的五行属性，来自对应的季节。地支后来也用来纪月，十二支直接对应十二个月份：寅卯辰是春，巳午未是夏，申酉戌是秋，亥子丑是冬。春天草木生发，所以寅卯属木；夏天暑热蒸腾，所以巳午属火；秋天肃杀收敛，所以申酉属金；冬天寒凉闭藏，所以亥子属水。每个季节的最后一个月，辰、未、戌、丑，是季节交替的过渡阶段，全部归属于土。' },
      { p: '到这里，每一对干支都成了一个具体的五行组合：甲子，是阳木遇上子水；丙午，是阳火遇上午火。六十甲子，就是六十种完全不同的五行搭配，各有各的脾气。轮到哪一天，哪一天就是那副样子。原本只是标记刻度的时间，走到这里，就有了自己的性格。' },
      { p: '至此，三层结合全部完成。一对干支，先天有阴阳，再带五行，又各具意象。\n剩下的问题只有一个：这些符号，和你有什么关系？' },
    ],
  },
  {
    id: 'birth-chart',
    nav: 'Birth Chart',
    navCn: '生辰八字',
    titleEn: 'The Birth Chart',
    titleCn: '生辰八字',
    en: [
      { sub: 'Four Pillars' },
      { p: 'The stems and branches began with the days. In time, the same wheels spread to the years, the months, and the hours, four scales turning independently, side by side. Your zodiac animal comes from here: it is simply the animal of your birth year’s branch. Any moment can be read as four stem-branch pairs at once.' },
      { p: 'At the moment you were born, each wheel stood on a pair. Year, month, day, and hour: four pillars, eight characters in all. Nobody assigned them to you. They are simply the reading of the four wheels at that moment, and you happened to arrive then.' },
      { sub: 'The Day Master' },
      { p: 'Among the eight, the stem of your day pillar stands for you. It is one of the ten stems, and it carries that stem’s element and charge. The other seven characters arrange themselves around it, each relating to your element in its own way. Together they make up the shape of your chart.' },
      { p: 'Reading a person through these four pillars was refined and settled in the Tang and Song dynasties, and every almanac tradition since has been built on it. If you’ve read this far, you now know every part of the machine.' },
    ],
    cn: [
      { sub: '四柱' },
      { p: '前面说过，干支最早是用来纪日的。' },
      { p: '后来这套轮子越铺越广：纪年、纪月、纪时，四个时间尺度各转各的，互不干扰。你的属相，就来自出生年份的地支：那一年的地支是什么，对应的生肖动物就是你的属相。' },
      { p: '世间任何一个具体时刻，都能同时读出四对干支。' },
      { p: '你出生的那一刻，四个轮子刚好各自停在一对干支上。年柱、月柱、日柱、时柱，一共四柱，加起来八个字，这就是大家常说的「生辰八字」。它不是谁特意分配给你的，只是那个特定时刻的四轮读数，而你恰好在那时到来。' },
      { sub: '日主' },
      { p: '这八个字里，日柱的天干直接代表你自己，被称为「日主」。你的日主是十天干中的某一个，自然就带着这一干对应的五行与阴阳。剩下的七个字，围绕日主排布，各自与你的日主发生生克，构成属于你的格局。' },
      { p: '以日主为核心解读命盘的方法，在唐宋之间逐步定型。之后的上千年里，黄历择日、命理推演，全部都建立在这套四柱体系的基础之上。读到这里，你已经认识了它全部的零件。' },
    ],
  },
];

/** The Yin & Yang photo's caption, per language. */
export const taijiCaption = {
  en: 'Detail of Three Stars Present Longevity with Taiji Diagram · Qing Dynasty',
  cn: '三星太极献寿图（局部）· 清代',
};

/** The credit section's underlined names — targets to fill in when decided. */
export const creditLinks: Record<string, string> = {
  'Bill Chien': 'https://www.billchien.net',
  'Cahya Sofyan': 'https://www.behance.net/cahyasofyan?locale=en_US',
};
