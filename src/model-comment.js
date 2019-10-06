class ModelComment {
  constructor(data) {
    this.id = data[`id`] || null;
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

  static toRAW(data) {
    return {
      'comment': data.text,
      'date': new Date(data.published).toISOString(),
      'emotion': data.emoji,
    };
  }
}

export {ModelComment};
