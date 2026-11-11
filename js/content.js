// All copy lives here so it can be edited without touching logic or layout.

/** Indexed to match ANIMALS in zodiac.js (Rat = 0 ... Pig = 11). */
export const SIGNS = [
  {
    name: 'Rat', hanzi: '鼠', pinyin: 'shǔ',
    traits: ['Quick-witted', 'Resourceful', 'Charming'],
    cardTrait: 'Quick-witted',
    blurb: 'First across the river in the great race. You spot the opening before anyone else knows there is a door.',
    strength: 'Turning very little into quite a lot.',
    watch: 'Keeping every worry to yourself.',
  },
  {
    name: 'Ox', hanzi: '牛', pinyin: 'niú',
    traits: ['Steadfast', 'Patient', 'Dependable'],
    cardTrait: 'Steadfast',
    blurb: 'The one who carried the Rat most of the way. You finish what you start, and people build their plans around that.',
    strength: 'Quiet, unshakeable follow-through.',
    watch: 'Digging in when a new path would be easier.',
  },
  {
    name: 'Tiger', hanzi: '虎', pinyin: 'hǔ',
    traits: ['Brave', 'Magnetic', 'Restless'],
    cardTrait: 'Brave',
    blurb: 'You leap first and work out the landing in mid-air. Rooms feel different once you have walked in.',
    strength: 'Courage that other people borrow.',
    watch: 'Charging ahead before the plan is ready.',
  },
  {
    name: 'Rabbit', hanzi: '兔', pinyin: 'tù',
    traits: ['Gentle', 'Perceptive', 'Graceful'],
    cardTrait: 'Perceptive',
    blurb: 'The Moon keeps a rabbit for company, and it is easy to see why. You read a room in a heartbeat and smooth it without a word.',
    strength: 'Making people feel at ease.',
    watch: 'Avoiding the hard conversation.',
  },
  {
    name: 'Dragon', hanzi: '龙', pinyin: 'lóng',
    traits: ['Bold', 'Visionary', 'Generous'],
    cardTrait: 'Visionary',
    blurb: 'The only sign that lives in the sky. You think in big arcs and expect the world to keep up.',
    strength: 'Belief that carries a whole team.',
    watch: 'Forgetting that not everyone can fly.',
  },
  {
    name: 'Snake', hanzi: '蛇', pinyin: 'shé',
    traits: ['Wise', 'Intuitive', 'Composed'],
    cardTrait: 'Intuitive',
    blurb: 'Still on the surface, always thinking underneath. You know more than you say, and you say it at exactly the right time.',
    strength: 'Seeing what sits beneath the surface.',
    watch: 'Trusting slowly, forgiving slower.',
  },
  {
    name: 'Horse', hanzi: '马', pinyin: 'mǎ',
    traits: ['Free-spirited', 'Energetic', 'Warm'],
    cardTrait: 'Free-spirited',
    blurb: 'Happiest at full gallop with open ground ahead. Your energy is catching, and so is your laugh.',
    strength: 'Getting everyone moving.',
    watch: 'Bolting when things feel fenced in.',
  },
  {
    name: 'Goat', hanzi: '羊', pinyin: 'yáng',
    traits: ['Kind', 'Creative', 'Calm'],
    cardTrait: 'Creative',
    blurb: 'Soft-footed on steep ground. You bring beauty and calm to places that had neither.',
    strength: 'A gentle touch with real backbone.',
    watch: 'Letting others choose for you.',
  },
  {
    name: 'Monkey', hanzi: '猴', pinyin: 'hóu',
    traits: ['Clever', 'Playful', 'Inventive'],
    cardTrait: 'Inventive',
    blurb: 'Every puzzle is a game and every rule is a suggestion. You solve it sideways while everyone else is still reading the instructions.',
    strength: 'Finding the trick nobody else saw.',
    watch: 'Getting bored one step before the end.',
  },
  {
    name: 'Rooster', hanzi: '鸡', pinyin: 'jī',
    traits: ['Observant', 'Honest', 'Polished'],
    cardTrait: 'Observant',
    blurb: 'Up before the sun and proud of it. You notice the detail everyone missed and you are not shy about saying so.',
    strength: 'High standards, kept daily.',
    watch: 'Honesty that lands a little sharp.',
  },
  {
    name: 'Dog', hanzi: '狗', pinyin: 'gǒu',
    traits: ['Loyal', 'Fair-minded', 'Protective'],
    cardTrait: 'Loyal',
    blurb: 'Once you are on someone’s side, you stay there. You can smell unfairness from three streets away.',
    strength: 'Showing up, every single time.',
    watch: 'Worrying on behalf of everyone.',
  },
  {
    name: 'Pig', hanzi: '猪', pinyin: 'zhū',
    traits: ['Generous', 'Sincere', 'Easy-going'],
    cardTrait: 'Generous',
    blurb: 'Last over the line because you stopped for a good meal, and you would do it again. Life is to be enjoyed and shared.',
    strength: 'A big heart and an open table.',
    watch: 'Trusting a little too easily.',
  },
];

/** Indexed to match ELEMENTS in zodiac.js. `color` drives the element chapter accent. */
export const ELEMENT_INFO = [
  {
    name: 'Wood', hanzi: '木', color: '#5fbf8f', planet: 'Jupiter', season: 'Spring',
    blurb: 'Wood grows. It lends your sign reach, warmth and a habit of pushing toward the light.',
  },
  {
    name: 'Fire', hanzi: '火', color: '#ff6a4d', planet: 'Mars', season: 'Summer',
    blurb: 'Fire rises. It lends your sign spark, drive and a glow that people gather around.',
  },
  {
    name: 'Earth', hanzi: '土', color: '#e0a94f', planet: 'Saturn', season: 'The turning of seasons',
    blurb: 'Earth holds. It lends your sign balance, patience and a steadying hand.',
  },
  {
    name: 'Metal', hanzi: '金', color: '#dfe3ee', planet: 'Venus', season: 'Autumn',
    blurb: 'Metal refines. It lends your sign focus, resolve and a clear, bright edge.',
  },
  {
    name: 'Water', hanzi: '水', color: '#5aa9ff', planet: 'Mercury', season: 'Winter',
    blurb: 'Water flows. It lends your sign depth, intuition and a way around any obstacle.',
  },
];

export const POLARITY_INFO = {
  Yang: { hanzi: '阳', blurb: 'Yang year: outward, active, quick to begin.' },
  Yin: { hanzi: '阴', blurb: 'Yin year: inward, receptive, built to last.' },
};

export const ANIMAL_RELATION_COPY = {
  harmony: {
    title: 'Secret friends',
    text: 'One of the six harmonies: signs that tradition says quietly look out for each other. A bond that holds up over any distance.',
  },
  trine: {
    title: 'Kindred spirits',
    text: 'You share a trine of affinity, signs said to think alike and want the same things. Easy company from the first hello.',
  },
  same: {
    title: 'Mirror signs',
    text: 'Same sign, same instincts. You understand each other instantly, which is wonderful until you both want the last word.',
  },
  neutral: {
    title: 'Good neighbours',
    text: 'No ancient drama here. Nothing is promised and nothing is in the way, so it is whatever the two of you make it.',
  },
  harm: {
    title: 'Worth the effort',
    text: 'Tradition says these signs can rub each other the wrong way. Name the friction early and it usually becomes a running joke.',
  },
  clash: {
    title: 'Opposites on the wheel',
    text: 'You sit directly across the wheel from each other, which makes for lively conversations. Opposites see what the other misses, when they are willing to listen.',
  },
};

export const ELEMENT_RELATION_COPY = {
  generating: (a, b) => `${a} and ${b} sit side by side in the generating cycle, so one naturally feeds the other.`,
  same: (a) => `You are both ${a}, which doubles the element’s gifts and its blind spots.`,
  controlling: (a, b) => `${a} and ${b} check each other in the controlling cycle: a little tension that keeps you both honest.`,
};
