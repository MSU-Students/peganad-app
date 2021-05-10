import firebaseService from "./firebase-content.service.js";
import router from "../router";
import store from "../store/index.js";
import localbaseService from "../services/localbase-content.service.js";

// eslint-disable-next-line no-unused-vars
let downloadByName = false;
class DownloadContent {
  async checkContents() {
    const collection = await localbaseService.getContent();
    if (collection.length == 4) {
      // has collection of (animals)
      let status = store.state.status;
      if (status.docSize != 0) {
        const localDocSize = await localbaseService.getContentByKey(
          status.category
        );
        if (status.docSize != localDocSize[status.category].length) {
          await localbaseService.deleteContentByKey(status.category);
          return false;
        } else return true;
      }
      return true;
    } else {
      // no collection
      return false;
    }
  }

  async downloadContentByName(collectionName) {
    let contentObj = {};
    let collection = await firebaseService.getContentByName(collectionName);
    contentObj[collectionName] = collection;
    await this.updateContent(contentObj[collectionName], [collectionName]).then(
      () => {
        downloadByName = true;
      }
    );
  }

  async downloadContent(cb) {
    try {
      if (this.checkContents()) {
        const content = await localbaseService.getContentWithKey();
        const checkAnimal = content.some((item) => item.key == "animals");
        if (!checkAnimal) await firebaseService.getAnimals(cb);
        const checkColor = content.some((item) => item.key == "colors");
        if (!checkColor) await firebaseService.getColors(cb);
        const checkNumber = content.some((item) => item.key == "numbers");
        if (!checkNumber) await firebaseService.getNumbers(cb);
        const checkWord = content.some((item) => item.key == "words");
        if (!checkWord) await firebaseService.getWords(cb);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async updateContent(docData, category) {
    // updating content into new base64 value
    return new Promise((resolve) => {
      try {
        if (typeof docData != "undefined") {
          let newContent = [];
          let docSize = store.state.status.docSize;
          docData.map(async (doc) => {
            let updatedContent = {
              name: doc.name,
              translatedName: doc.translatedName,
              img: await this.getBase64FromUrl(doc.img),
              audio: await this.getBase64FromUrl(doc.audio),
            };
            newContent.push(updatedContent);
            if (newContent.length == docSize) {
              const result = await this.storeDataToLocalDB(
                newContent,
                category
              );
              resolve(result);
            }
          });
        }
      } catch (error) {
        console.log(error);
      }
    });
  }

  async getBase64FromUrl(url) {
    try {
      if (navigator.onLine) {
        var res = await fetch(url);
        var blob = await res.blob();

        return new Promise((resolve, reject) => {
          var reader = new FileReader();
          reader.addEventListener(
            "load",
            function() {
              var base64data = reader.result.substr(
                reader.result.indexOf(",") + 1
              );
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
    } catch (error) {
      console.log(error);
      store.commit("status", {
        docSize: 0,
        progress: 0,
        payload: null,
        category: "",
      });
    }
  }

  async storeDataToLocalDB(docData, category) {
    return new Promise((resolve) => {
      (async () => {
        const result = await localbaseService.addContent(docData, category);
        if (store.state.status.done) {
          store.commit("status", {
            docSize: 0,
            progress: 0,
            payload: null,
            category: "",
            done: false,
          });
          setTimeout(async () => {
            await router.replace("/home");
          }, 1000);
        }
        resolve(result);
      })();
    });
  }
}

let downloadContent = new DownloadContent();
export default downloadContent;
