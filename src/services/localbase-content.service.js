import Localbase from "localbase";

let localDB = new Localbase("db");
localDB.config.debug = false;

class LocalbaseService {
  async addContent(payload, category) {
    return new Promise((resolve) => {
      (async () => {
        const result = await localDB
          .collection("contents")
          .add(
            { [category]: payload },
            typeof category == "string" ? category : category[0]
          )
          .catch((err) => console.log(err.message));
        resolve(result);
      })();
    });
  }

  async getContent() {
    const result = await localDB.collection("contents").get();
    return result;
  }

  async getContentWithKey() {
    const result = await localDB.collection("contents").get({ keys: true });
    return result;
  }

  async getContentByKey(key) {
    const result = await localDB
      .collection("contents")
      .doc(key)
      .get();
    return result;
  }

  async deleteContent() {
    const result = await localDB.collection("contents").delete();
    return result;
  }

  async deleteContentByKey(key) {
    const result = await localDB
      .collection("contents")
      .doc(key)
      .delete();
    return result;
  }

  async deleteDB() {
    const result = await localDB.delete();
    return result;
  }
}

let localbaseService = new LocalbaseService();
export default localbaseService;
