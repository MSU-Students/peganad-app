import {
  animalsQuery,
  colorsQuery,
  numbersQuery,
  wordsQuery,
  firestoreDB,
} from "../firestore/firebaseInit.js";
import store from "../store/index.js";

// eslint-disable-next-line no-unused-vars
let nextQuery = undefined;
let cursor = 0;
class FirebaseService {
  async getAnimals(cb) {
    let animalArr = [];
    return new Promise((resolve) => {
      (async () => {
        try {
          let documentSize = (await animalsQuery.get()).docs.length;
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
              animalArr.push(nextQuery.data());
              cursor += 1;
              cb({
                docSize: documentSize,
                progress: cursor,
                category: "animals",
              });
            } else {
              cursor = 0;
              nextQuery = undefined;
              store.commit("status", {
                docSize: 0,
                progress: 0,
                payload: null,
                category: "",
              });
            }
          } while (cursor < documentSize && navigator.onLine);
          if (cursor == documentSize) {
            resolve(
              cb({
                docSize: documentSize,
                progress: cursor,
                payload: animalArr,
                category: "animals",
              })
            );
          }
        } catch (error) {
          console.log(error);
        }
      })();
    });
  }

  async getColors(cb) {
    let colorArr = [];
    cursor = 0;
    nextQuery = undefined;
    store.commit("status", {
      docSize: 0,
      progress: 0,
      payload: null,
      category: "",
    });
    return new Promise((resolve) => {
      (async () => {
        try {
          let documentSize = (await colorsQuery.get()).docs.length;
          do {
            let firstQuery = nextQuery
              ? colorsQuery
                  .orderBy("name")
                  .limit(1)
                  .startAfter(nextQuery)
              : colorsQuery.orderBy("name").limit(1);
            let docSnapshot = await firstQuery.get();
            nextQuery = docSnapshot.docs[0];
            if (nextQuery) {
              colorArr.push(nextQuery.data());
              cursor += 1;
              cb({
                docSize: documentSize,
                progress: cursor,
                category: "colors",
              });
            } else {
              cursor = 0;
              nextQuery = undefined;
              store.commit("status", {
                docSize: 0,
                progress: 0,
                payload: null,
                category: "",
              });
            }
          } while (cursor < documentSize && navigator.onLine);
          if (cursor == documentSize) {
            resolve(
              cb({
                docSize: documentSize,
                progress: cursor,
                payload: colorArr,
                category: "colors",
              })
            );
          }
        } catch (error) {
          console.log(error);
        }
      })();
    });
  }

  async getNumbers(cb) {
    let numberArr = [];
    cursor = 0;
    nextQuery = undefined;
    store.commit("status", {
      docSize: 0,
      progress: 0,
      payload: null,
      category: "",
    });
    return new Promise((resolve) => {
      (async () => {
        try {
          let documentSize = (await numbersQuery.get()).docs.length;
          do {
            let firstQuery = nextQuery
              ? numbersQuery
                  .orderBy("name")
                  .limit(1)
                  .startAfter(nextQuery)
              : numbersQuery.orderBy("name").limit(1);
            let docSnapshot = await firstQuery.get();
            nextQuery = docSnapshot.docs[0];
            if (nextQuery) {
              numberArr.push(nextQuery.data());
              cursor += 1;
              cb({
                docSize: documentSize,
                progress: cursor,
                category: "numbers",
              });
            } else {
              cursor = 0;
              nextQuery = undefined;
              store.commit("status", {
                docSize: 0,
                progress: 0,
                payload: null,
                category: "",
              });
            }
          } while (cursor < documentSize && navigator.onLine);
          if (cursor == documentSize) {
            resolve(
              cb({
                docSize: documentSize,
                progress: cursor,
                payload: numberArr,
                category: "numbers",
              })
            );
          }
        } catch (error) {
          console.log(error);
        }
      })();
    });
  }

  async getWords(cb) {
    let wordArr = [];
    cursor = 0;
    nextQuery = undefined;
    store.commit("status", {
      docSize: 0,
      progress: 0,
      payload: null,
      category: "",
    });
    return new Promise((resolve) => {
      (async () => {
        try {
          let documentSize = (await wordsQuery.get()).docs.length;
          do {
            let firstQuery = nextQuery
              ? wordsQuery
                  .orderBy("name")
                  .limit(1)
                  .startAfter(nextQuery)
              : wordsQuery.orderBy("name").limit(1);
            let docSnapshot = await firstQuery.get();
            nextQuery = docSnapshot.docs[0];
            if (nextQuery) {
              wordArr.push(nextQuery.data());
              cursor += 1;
              cb({
                docSize: documentSize,
                progress: cursor,
                category: "words",
              });
            } else {
              cursor = 0;
              nextQuery = undefined;
              store.commit("status", {
                docSize: 0,
                progress: 0,
                payload: null,
                category: "",
              });
            }
          } while (cursor < documentSize && navigator.onLine);
          if (cursor == documentSize) {
            resolve(
              cb({
                docSize: documentSize,
                progress: cursor,
                payload: wordArr,
                category: "words",
                done: true,
              })
            );
          }
        } catch (error) {
          console.log(error);
        }
      })();
    });
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

let firebaseService = new FirebaseService();
export default firebaseService;
