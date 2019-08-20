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

export {getStats, getRank};
