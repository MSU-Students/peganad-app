import {
  animalsQuery,
  colorsQuery,
  numbersQuery,
  wordsQuery,
  firestoreDB,
} from "../firestore/firebaseInit.js";
import Localbase from "localbase";

let localDB = new Localbase("db");
localDB.config.debug = false;

// eslint-disable-next-line no-unused-vars
let nextQuery = undefined;
let cursor = 0;
class ContentService {
  async getAnimals(cb) {
    try {
      let collectionSize = (await animalsQuery.get()).docs.length;
      do {
        let firstQuery = nextQuery
          ? animalsQuery
              .orderBy("name")
              .limit(1)
              .startAfter(nextQuery)
          : animalsQuery.orderBy("name").limit(1);
        let docSnapshot = await firstQuery.get();
        nextQuery = docSnapshot.docs[0];
        if (nextQuery) {
          cursor += 1;
          cb({
            progress: cursor,
            payload: nextQuery.data(),
            category: "animals",
          });
        } else {
          cursor = 0;
          break;
        }
      } while (cursor < collectionSize);
      // done download all contents stop all loading
    } catch (error) {
      console.log(error);
    }
  }

  async getColors() {
    let colorArr = [];
    const res = await colorsQuery.get();
    res.forEach((r) => {
      colorArr.push(r.data());
    });
    return colorArr;
  }

  async getNumbers() {
    let numberArr = [];
    const res = await numbersQuery.get();
    res.forEach((r) => {
      numberArr.push(r.data());
    });
    return numberArr;
  }

  async getWords() {
    let wordsArr = [];
    const res = await wordsQuery.get();
    res.forEach((r) => {
      wordsArr.push(r.data());
    });
    return wordsArr;
  }

  async getContentByName(collectionName) {
    let contentArr = [];
    const res = await firestoreDB.collection(collectionName).get();
    res.forEach((r) => {
      contentArr.push(r.data());
    });
    return contentArr;
  }
}

let contentService = new ContentService();
export default contentService;
