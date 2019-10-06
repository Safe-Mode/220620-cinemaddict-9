const getStats = (films) => {
  return films.reduce((stat, {user}) => {
    stat.watchlist += Number(user.watchlist);
    stat.watched += Number(user.watched);
    stat.favorite += Number(user.favorite);

    return stat;
  }, {
    watchlist: 0,
    watched: 0,
    favorite: 0,
  });
};

const getRank = (amount, rankMap) => {
  let prevRank;
  let rank;

  for (let [key, value] of rankMap) {
    if (amount < key) {
      rank = prevRank;
    } else {
      prevRank = value;
    }
  }

  rank = (!rank) ? prevRank : rank;

  return rank;
};

const createElement = (template) => {
  const dummy = document.createElement(`div`);
  dummy.innerHTML = template;
  return dummy.firstElementChild;
};

const render = (container, element, position = `end`) => {
  if (typeof position === `number`) {
    container.replaceChild(element, container.children[position]);
    return;
  }

  const insert = {
    end: `append`,
    begin: `prepend`,
  };

  container[insert[position]](element);
};

const unrender = (element) => {
  element.remove();
};

const isEscPressed = (key) => {
  return key === `Escape` || key === `Esc`;
};

const isEnterPressed = (key) => {
  return key === `Enter`;
};

const rankMap = new Map([
  [1, `Novice`],
  [11, `Fan`],
  [21, `Movie Buff`],
]);

export {getStats, getRank, createElement, render, unrender, isEscPressed, isEnterPressed, rankMap};
