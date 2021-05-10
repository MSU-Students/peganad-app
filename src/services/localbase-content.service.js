import Localbase from "localbase";

let localDB = new Localbase("db");
localDB.config.debug = false;

class LocalbaseService {
  async addContent(payload, category) {
    const result = await localDB
      .collection("contents")
      .add(
        { [category]: payload },
        typeof category == "string" ? category : category[0]
      )
      .catch((err) => console.log(err.message));
    return result;
  }

  async getContent() {
    const result = await localDB.collection("contents").get();
    return result;
  }

  async deleteContent() {
    const result = await localDB.collection("contents").delete();
    return result;
  }
}

let localbaseService = new LocalbaseService();
export default localbaseService;
