import store from "../store";

import contentService from "../services/content.service.js";
import Localbase from "localbase";

let localDB = new Localbase("db");
localDB.config.debug = false;

let counter = 0;
let downloadByName = false;
class DownloadContent {
  async checkLocalContent() {
    const db = await localDB.collection("contents").get();
    if (db.length == 4) {
      // has db
      return true;
    } else {
      // no db
      localDB
        .collection("contents")
        .delete()
        .then(() => {
          return false;
        });
    }
  }

  async downloadContentByName(collectionName) {
    let contentObj = {};
    let collection = await contentService.getContentByName(collectionName);
    contentObj[collectionName] = collection;
    await this.updateContent(contentObj[collectionName], [collectionName]).then(
      () => {
        downloadByName = true;
      }
    );
  }

  async downloadContent() {
    let contentObj = {};
    counter = 0;
    await Promise.all([
      (async () => {
        let animals = await contentService.getAnimals();
        contentObj.animals = animals;
        await this.updateContent(contentObj.animals, "animals");
      })(),
      (async () => {
        let colors = await contentService.getColors();
        contentObj.colors = colors;
        await this.updateContent(contentObj.colors, "colors");
      })(),
      (async () => {
        let numbers = await contentService.getNumbers();
        contentObj.numbers = numbers;
        await this.updateContent(contentObj.numbers, "numbers");
      })(),
      (async () => {
        let words = await contentService.getWords();
        contentObj.words = words;
        await this.updateContent(contentObj.words, "words");
      })().catch((err) => {
        console.log(err);
      }),
    ]);
  }

  async updateContent(docData, docName) {
    let arrContent = docData;
    let response = [];
    await Promise.all([
      (async () => {
        await arrContent.map(async (doc) => {
          if (doc.img) {
            await this.getBase64FromUrl(doc.img)
              .then(async (result) => {
                response.push(result);
                let contentIndex = arrContent.findIndex(
                  (content) => content.img === doc.img
                );
                arrContent[contentIndex].img = result;
                if (response.length === arrContent.length) {
                  response = [];
                  if (doc.audio) {
                    arrContent.forEach(async (doc) => {
                      await this.getBase64FromUrl(doc.audio)
                        .then(async (result) => {
                          response.push(result);
                          let contentIndex = arrContent.findIndex(
                            (content) => content.audio === doc.audio
                          );
                          arrContent[contentIndex].audio = result;
                          if (response.length === arrContent.length) {
                            await this.storeDataToLocalDB(arrContent, docName);
                          }
                        })
                        .catch((err) => console.error(err));
                    });
                  } else {
                    await this.storeDataToLocalDB(arrContent, docName);
                  }
                }
              })
              .catch((err) => {
                arrContent = [];
                response = [];
                console.error(err);
              });
          }
        });
      })().catch((err) => {
        arrContent = [];
        response = [];
        console.log(err);
      }),
    ]);
  }

  async storeDataToLocalDB(docData, docName) {
    await localDB
      .collection("contents")
      .add(
        { [docName]: docData },
        typeof docName == "string" ? docName : docName[0]
      )
      .then(() => {
        counter++;
        console.log(counter);
      })
      .catch((err) => {
        console.log(err);
      });
    if (counter >= 4) {
      store.dispatch("isHide", false);
    } else if (downloadByName) {
      if (docName[0] == "aniamls") {
        store.dispatch("isHide", 0);
      } else if (docName[0] == "colors") {
        store.dispatch("isHide", 1);
      } else if (docName[0] == "numbers") {
        store.dispatch("isHide", 2);
      } else if (docName[0] == "words") {
        store.dispatch("isHide", 3);
      }
    }
  }

  async getBase64FromUrl(url) {
    var res = await fetch(url);
    var blob = await res.blob();

    return new Promise((resolve, reject) => {
      var reader = new FileReader();
      reader.addEventListener(
        "load",
        function() {
          var base64data = reader.result.substr(reader.result.indexOf(",") + 1);
          resolve(base64data);
        },
        false
      );

      reader.onerror = () => {
        return reject(this);
      };
      reader.readAsDataURL(blob);
    });
  }
}

let downloadContent = new DownloadContent();
export default downloadContent;
