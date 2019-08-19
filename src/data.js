const TITLE_FISH = `Разнообразный и богатый опыт постоянное информационно-пропагандистское обеспечение нашей деятельности позволяет оценить значение системы обучения кадров, соответствует насущным потребностям`.split(` `);
const DESC_FISH = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.`.split(`. `);
const COMMENTS_FISH = `Не следует, однако забывать, что сложившаяся структура организации обеспечивает широкому кругу (специалистов) участие в формировании систем массового участия. Не следует, однако забывать, что начало повседневной работы по формированию позиции требуют определения и уточнения существенных финансовых и административных условий. С другой стороны реализация намеченных плановых заданий требуют от нас анализа модели развития. С другой стороны новая модель организационной деятельности позволяет выполнять важные задания по разработке системы обучения кадров, соответствует насущным потребностям. С другой стороны дальнейшее развитие различных форм деятельности играет важную роль в формировании дальнейших направлений развития.`.split(`. `);

const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min)) + min;
};

const filmCard = {
  poster: [
    `made-for-each-other.png`,
    `popeye-meets-sinbad.png`,
    `sagebrush-trail.jpg`,
    `santa-claus-conquers-the-martians.jpg`,
    `the-dance-of-life.jpg`,
    `the-great-flamarion.jpg`,
    `the-man-with-the-golden-arm.jpg`,
  ][getRandomInt(0, 7)],
  title: (() => {
    return new Array(getRandomInt(1, 3)).fill(``).reduce((title) => {
      let result = `${title} ${TITLE_FISH[getRandomInt(0, TITLE_FISH.length)]}`.trim();
      return `${result[0].toUpperCase()}${result.slice(1)}`;
    }, ``);
  })(),
  rates: parseFloat(`${getRandomInt(5, 9)}.${getRandomInt(0, 9)}`),
  year: getRandomInt(1900, 2019),
  duration: getRandomInt(30, 180),
  genre: [
    `Musical`,
    `Western`,
    `Drama`,
    `Comedy`,
    `Cartoon`,
    `Mystery`,
  ][getRandomInt(0, 6)],
  description: (() => {
    return new Array(getRandomInt(1, 3)).fill(``).reduce((description) => `${description} ${DESC_FISH[getRandomInt(0, DESC_FISH.length)]}.`.trim(), ``);
  })(),
  comments: (() => {
    return new Array(getRandomInt(0, 5)).fill(``).reduce((comments) => {
      comments.push(COMMENTS_FISH[getRandomInt(0, COMMENTS_FISH.length)]);
      return comments;
    }, []);
  })(),
};

export {filmCard};
