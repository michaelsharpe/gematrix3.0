import DataLoader from 'dataloader';
import findByIds from 'mongo-find-by-ids';

export default class Letter {
  constructor(context) {
    this.context = context;
    this.collection = context.db.collection('letter');
    this.pubsub = context.pubsub;
    this.loader = new DataLoader(ids => findByIds(this.collection, ids));
  }

  findOneById(id) {
    return this.loader.load(id);
  }

  all({ lastCreatedAt = 0, limit = 10 }) {
    return this.collection.find({
      createdAt: { $gt: lastCreatedAt },
    }).sort({ createdAt: 1 }).limit(limit).toArray();
  }

  word(letter) {
    return this.context.Word.findOneById(letter.wordId);
  }

  user(letter) {
    return this.context.User.findOneById(letter.userId);
  }

  numeral(letter) {
    return this.context.Numeral.findOneById(letter.numeralId);
  }

  correspondences(letter, { lastCreatedAt = 0, limit = 10 }) {
    return this.context.Correspondence.collection.find({
      letterId: letter._id,
      createdAt: { $gt: lastCreatedAt },
    }).sort({ createdAt: 1 }).limit(limit).toArray();
  }

  async insert(doc) {
    const docToInsert = Object.assign({}, doc, {
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    const id = (await this.collection.insertOne(docToInsert)).insertedId;
    this.pubsub.publish('letterInserted', await this.findOneById(id));
    return id;
  }

  async updateById(id, doc) {
    const ret = await this.collection.update({ _id: id }, {
      $set: Object.assign({}, doc, {
        updatedAt: Date.now(),
      }),
    });
    this.loader.clear(id);
    this.pubsub.publish('letterUpdated', await this.findOneById(id));
    return ret;
  }

  async removeById(id) {
    const ret = this.collection.remove({ _id: id });
    this.loader.clear(id);
    this.pubsub.publish('letterRemoved', id);
    return ret;
  }
}
