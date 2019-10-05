class ModelMovie {
  constructor(data) {
    this.id = data[`id`];
    this.poster = data[`film_info`][`poster`];
    this.title = data[`film_info`][`title`];
    this.alt = data[`film_info`][`alternative_title`];
    this.rate = data[`film_info`][`total_rating`];
    this.release = new Date(data[`film_info`][`release`][`date`]).getTime();
    this.duration = data[`film_info`][`runtime`];
    this.genres = new Set(data[`film_info`][`genre`]);
    this.description = data[`film_info`][`description`];
    this.comments = data[`comments`] || [];
    this.user = {};
    this.user.watchlist = Boolean(data[`user_details`][`watchlist`]);
    this.user.watched = Boolean(data[`user_details`][`already_watched`]);
    this.user.favorite = Boolean(data[`user_details`][`favorite`]);
    this.user.rating = data[`user_details`][`personal_rating`];
    this.user.watchingDate = new Date(data[`user_details`][`watching_date`]).getTime();
    this.director = data[`film_info`][`director`];
    this.writers = data[`film_info`][`writers`];
    this.actors = data[`film_info`][`actors`];
    this.country = data[`film_info`][`release`][`release_country`];
    this.age = data[`film_info`][`age_rating`];
  }

  static parseMovie(data) {
    return new ModelMovie(data);
  }

  static parseMovies(data) {
    return data.map(ModelMovie.parseMovie);
  }

  toRAW() {
    const userDetails = {};
    const filmInfo = {};
    const release = {};

    userDetails[`watchlist`] = this.user.watchlist;
    userDetails[`already_watched`] = this.user.watched;
    userDetails[`favorite`] = this.user.favorite;
    userDetails[`personal_rating`] = this.user.rating || 0;
    userDetails[`watching_date`] = new Date(this.user.watchingDate).toISOString();
    filmInfo[`poster`] = this.poster;
    filmInfo[`title`] = this.title;
    filmInfo[`alternative_title`] = this.alt;
    filmInfo[`total_rating`] = this.rate;
    release[`date`] = new Date(this.release).toISOString();
    release[`release_country`] = this.country;
    filmInfo[`release`] = release;
    filmInfo[`runtime`] = this.duration;
    filmInfo[`genre`] = [...this.genres];
    filmInfo[`description`] = this.description;
    filmInfo[`director`] = this.director;
    filmInfo[`writers`] = this.writers;
    filmInfo[`actors`] = this.actors;
    filmInfo[`age_rating`] = this.age;

    return {
      'id': this.id,
      'user_details': userDetails,
      'film_info': filmInfo,
      'comments': this.comments,
    };
  }
}

export {ModelMovie};
