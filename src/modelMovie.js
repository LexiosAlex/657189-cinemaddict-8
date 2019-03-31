export default class ModelMovie {
  constructor(data) {
    this.id = data[`id`];
    this.comments = [];
    data.comments.forEach((it) => {
      const commentObj = {
        text: it.comment,
        author: it.author,
        addDate: it.date,
        emoji: it.emotion,
      };
      this.comments.push(commentObj);
    });
    this.rating = data[`film_info`][`total_rating`];
    this.ageRating = data[`film_info`][`age_rating`];
    this.year = new Date(data[`film_info`][`release`][`date`]);
    this.country = data[`film_info`][`release`][`release_country`];
    this.filmTitle = data[`film_info`][`title`];
    this.originalTitle = data[`film_info`][`alternative_title`];
    this.actors = new Set([]);
    data[`film_info`][`actors`].forEach((it) => {
      this.actors.add(it);
    });
    this.description = data[`film_info`][`description`];
    this.director = data[`film_info`][`director`];
    this.poster = data[`film_info`][`poster`];
    this.duration = data[`film_info`][`runtime`];
    this.writers = new Set([]);
    data[`film_info`][`writers`].forEach((it) => {
      this.writers.add(it);
    });
    this.isAlreadyWatched = Boolean(data[`user_details`][`already_watched`]);
    this.isFavorite = Boolean(data[`user_details`][`favorite`]);
    this.isWatchList = Boolean(data[`user_details`][`watchlist`]);
    this.userRate = Math.floor(data[`user_details`][`personal_rating`]);
    this.genres = new Set([]);
    data[`film_info`][`genre`].forEach((it) => {
      this.genres.add(it);
    });
  }

  static parseMovie(data) {
    return new ModelMovie(data);
  }

  static parseMovies(data) {
    return data.map(ModelMovie.parseMovie);
  }
}
