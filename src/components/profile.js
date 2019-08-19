const getProfileTpl = (amount, rankMap) => {
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

  return `
    <section class="header__profile profile">
      <p class="profile__rating">${rank}</p>
      <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
    </section>
  `;
};

export {getProfileTpl};
