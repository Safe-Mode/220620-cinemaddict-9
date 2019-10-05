class ModelComment {
  constructor(data) {
    this.id = data[`id`];
    this.name = data[`author`];
    this.published = new Date(data[`date`]).getTime();
    this.text = data[`comment`];
    this.emoji = data[`emotion`];
  }

  static parseComment(data) {
    return new ModelComment(data);
  }

  static parseComments(data) {
    return data.map(ModelComment.parseComment);
  }
}

export {ModelComment};
