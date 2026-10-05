// Animated emoji from Google's Noto set (fonts.gstatic.com). `char` is the
// native fallback shown if the animation fails to load.
export const EMOJI = {
  wave: { code: '1f44b', char: '👋' },
  sparkles: { code: '2728', char: '✨' },
  smile: { code: '1f60a', char: '😊' },
  relieved: { code: '1f60c', char: '😌' },
  neutral: { code: '1f610', char: '😐' },
  thinking: { code: '1f914', char: '🤔' },
  worried: { code: '1f61f', char: '😟' },
  weary: { code: '1f629', char: '😩' },
  exhale: { code: '1f62e_200d_1f4a8', char: '😮‍💨' },
  sleeping: { code: '1f634', char: '😴' },
  hug: { code: '1f917', char: '🤗' },
  starstruck: { code: '1f929', char: '🤩' },
  party: { code: '1f389', char: '🎉' },
  seedling: { code: '1f331', char: '🌱' },
  blossom: { code: '1f338', char: '🌸' },
  leaf: { code: '1f343', char: '🍃' },
  heart: { code: '1f496', char: '💖' },
  rainbow: { code: '1f308', char: '🌈' },
  muscle: { code: '1f4aa', char: '💪' },
  brain: { code: '1f9e0', char: '🧠' },
  laptop: { code: '1f4bb', char: '💻' },
  hourglass: { code: '23f3', char: '⏳' },
  peopleHugging: { code: '1fac2', char: '🫂' },
  sun: { code: '1f31e', char: '🌞' },
  writing: { code: '270d_fe0f', char: '✍️' },
  lotus: { code: '1fab7', char: '🪷' },
  clap: { code: '1f44f', char: '👏' },
  star: { code: '1f31f', char: '🌟' },
};

export const SECTION_EMOJI = {
  life: 'hourglass',
  focus: 'brain',
  digital: 'laptop',
  sleep: 'sleeping',
  body: 'muscle',
  connection: 'peopleHugging',
  mind: 'thinking',
  future: 'rainbow',
};

export const LEVEL_EMOJI = {
  Low: 'relieved',
  Moderate: 'neutral',
  High: 'exhale',
};
