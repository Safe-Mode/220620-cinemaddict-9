const getStats = (films) => {
  return films.reduce((stat, {user}) => {
    stat.watchlist += Number(user.watchlist);
    stat.watched += Number(user.watched);
    stat.favorites += Number(user.favorites);

    return stat;
  }, {
    watchlist: 0,
    watched: 0,
    favorites: 0,
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

export {getStats, getRank, createElement, render, unrender, isEscPressed};
