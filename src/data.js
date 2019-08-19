const TITLE_FISH = `Разнообразный и богатый опыт постоянное информационно-пропагандистское обеспечение нашей деятельности позволяет оценить значение системы обучения кадров, соответствует насущным потребностям`.split(` `);
const DESC_FISH = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.`.split(`. `);
const COMMENTS_FISH = `Не следует, однако забывать, что сложившаяся структура организации обеспечивает широкому кругу (специалистов) участие в формировании систем массового участия. Не следует, однако забывать, что начало повседневной работы по формированию позиции требуют определения и уточнения существенных финансовых и административных условий. С другой стороны реализация намеченных плановых заданий требуют от нас анализа модели развития. С другой стороны новая модель организационной деятельности позволяет выполнять важные задания по разработке системы обучения кадров, соответствует насущным потребностям. С другой стороны дальнейшее развитие различных форм деятельности играет важную роль в формировании дальнейших направлений развития.`.split(`. `);

const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min)) + min;
};

const getFilmData = () => {
  return {
    poster: [
      `made-for-each-other.png`,
      `popeye-meets-sinbad.png`,
      `sagebrush-trail.jpg`,
      `santa-claus-conquers-the-martians.jpg`,
      `the-dance-of-life.jpg`,
      `the-great-flamarion.jpg`,
      `the-man-with-the-golden-arm.jpg`,
    ][getRandomInt(0, 6)],
    title: (() => {
      return new Array(getRandomInt(1, 3)).fill(``).reduce((title) => {
        let result = `${title} ${TITLE_FISH[getRandomInt(0, TITLE_FISH.length - 1)]}`.trim();
        return `${result[0].toUpperCase()}${result.slice(1)}`;
      }, ``);
    })(),
    rate: parseFloat(`${getRandomInt(5, 9)}.${getRandomInt(0, 9)}`),
    release: -781326000000,
    duration: getRandomInt(30, 180),
    genres: (() => {
      return new Array(getRandomInt(1, 3)).fill(``).reduce((genres) => {
        genres.add([`Musical`, `Western`, `Drama`, `Comedy`, `Cartoon`, `Mystery`, `Film-Noir`][getRandomInt(0, 6)]);
        return genres;
      }, new Set());
    })(),
    description: (() => {
      return new Array(getRandomInt(1, 3)).fill(``).reduce((description) => `${description} ${DESC_FISH[getRandomInt(0, DESC_FISH.length - 1)]}.`.trim(), ``);
    })(),
    comments: [
      {
        name: `Anonymous`,
        published: [
          Date.now(),
          Date.now() - 1000 * 60 * 2,
          Date.now() - 1000 * 60 * 30,
          Date.now() - 1000 * 60 * 60,
          Date.now() - 1000 * 60 * 60 * 12,
          Date.now() - 1000 * 60 * 60 * 24,
          Date.now() - 1000 * 60 * 60 * 24 * 3
        ][getRandomInt(0, 6)],
        text: (() => {
          return new Array(getRandomInt(1, 5)).fill(``).reduce((sentences) => {
            sentences.push(COMMENTS_FISH[getRandomInt(0, COMMENTS_FISH.length - 1)]);
            return sentences;
          }, []).join(`. `);
        })(),
        emoji: [`smile`, `sleeping`, `puke`, `angry`][getRandomInt(0, 3)]
      }
    ],
    user: {
      watchlist: Boolean(Math.round(Math.random())),
      watched: Boolean(Math.round(Math.random())),
      favorites: Boolean(Math.round(Math.random())),
    },
    director: `Anthony Mann`,
    writers: [`Anne Wigton`, `Heinz Herald`, `Richard Weil`],
    actors: [`Erich von Stroheim`, `Mary Beth Hughes`, `Dan Duryea`],
    country: `USA`,
    age: 18,
  };
};

const films = [];

for (let i = 0; i < 17; i++) {
  films.push(getFilmData());
}

const amount = 22;

const rankMap = new Map([
  [1, `Novice`],
  [11, `Fan`],
  [21, `Movie Buff`],
]);

export {films, amount, rankMap};
