import {EMOJIS} from './const';

const Fish = {
  TITLE: `Разнообразный и богатый опыт постоянное информационно-пропагандистское обеспечение нашей деятельности позволяет оценить значение системы обучения кадров, соответствует насущным потребностям`.split(` `),
  DESC: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.`.split(`. `),
  COMMENTS: `Не следует, однако забывать, что сложившаяся структура организации обеспечивает широкому кругу (специалистов) участие в формировании систем массового участия. Не следует, однако забывать, что начало повседневной работы по формированию позиции требуют определения и уточнения существенных финансовых и административных условий. С другой стороны реализация намеченных плановых заданий требуют от нас анализа модели развития. С другой стороны новая модель организационной деятельности позволяет выполнять важные задания по разработке системы обучения кадров, соответствует насущным потребностям. С другой стороны дальнейшее развитие различных форм деятельности играет важную роль в формировании дальнейших направлений развития.`.split(`. `),
};

const POSTERS = [
  `made-for-each-other.png`,
  `popeye-meets-sinbad.png`,
  `sagebrush-trail.jpg`,
  `santa-claus-conquers-the-martians.jpg`,
  `the-dance-of-life.jpg`,
  `the-great-flamarion.jpg`,
  `the-man-with-the-golden-arm.jpg`,
];

const COMMENTS_DATE_POINTS = [
  Date.now(),
  Date.now() - 1000 * 60 * 2,
  Date.now() - 1000 * 60 * 30,
  Date.now() - 1000 * 60 * 60,
  Date.now() - 1000 * 60 * 60 * 12,
  Date.now() - 1000 * 60 * 60 * 24,
  Date.now() - 1000 * 60 * 60 * 24 * 3
];

const FILMS_QUANTITY = 17;
const GENRES = [`Musical`, `Western`, `Drama`, `Comedy`, `Cartoon`, `Mystery`, `Film-Noir`];
const AMOUNT = 22;

const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min)) + min;
};

const getRandomFromArray = (array) => {
  return array[getRandomInt(0, array.length - 1)];
};

const getIterableOfRandoms = (array, quantity, isUnique = false) => {
  const initVal = (isUnique) ? new Set() : [];
  const method = (isUnique) ? `add` : `push`;

  return new Array(getRandomInt(1, quantity)).fill(``).reduce((accumulator) => {
    accumulator[method](getRandomFromArray(array));
    return accumulator;
  }, initVal);
};

const getStringFromRandoms = (array, quantity, separator = ` `, isFirstCapital = true) => {
  const string = Array.from(getIterableOfRandoms(array, quantity)).join(separator);
  const result = (isFirstCapital) ? `${string[0].toUpperCase()}${string.slice(1)}` : string;

  return result.trim();
};

const getComments = () => {
  const texts = getIterableOfRandoms(Fish[`COMMENTS`], 5);

  return texts.map((text) => {
    return {
      name: `Anonymous`,
      published: getRandomFromArray(COMMENTS_DATE_POINTS),
      text,
      emoji: getRandomFromArray(EMOJIS),
    };
  });
};

const isWatched = Boolean(Math.round(Math.random()));

const getFilmData = () => {
  return {
    poster: getRandomFromArray(POSTERS),
    title: getStringFromRandoms(Fish[`TITLE`], 3),
    rate: parseFloat(`${getRandomInt(5, 9)}.${getRandomInt(0, 9)}`),
    release: getRandomInt(-781326000000, 1567088703157),
    duration: getRandomInt(30, 180),
    genres: getIterableOfRandoms(GENRES, 3, true),
    description: getStringFromRandoms(Fish[`DESC`], 5, `. `, false),
    comments: getComments(),
    user: {
      watchlist: Boolean(Math.round(Math.random())),
      watched: isWatched,
      favorite: Boolean(Math.round(Math.random())),
      rating: (isWatched) ? getRandomInt(1, 9) : null,
      watchingDate: getRandomInt(Date.now() - 31536000000, 1567088703157),
    },
    director: `Anthony Mann`,
    writers: [`Anne Wigton`, `Heinz Herald`, `Richard Weil`],
    actors: [`Erich von Stroheim`, `Mary Beth Hughes`, `Dan Duryea`],
    country: `USA`,
    age: 18,
  };
};

const films = [];

for (let i = 0; i < FILMS_QUANTITY; i++) {
  films.push(getFilmData());
}

export {films, AMOUNT as amount};
