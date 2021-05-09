import contentService from "../services/content.service.js";
import Localbase from "localbase";
import store from "../store/index.js";
import router from "../router";

let localDB = new Localbase("db");
localDB.config.debug = false;

// eslint-disable-next-line no-unused-vars
let downloadByName = false;
let content = [];
class DownloadContent {
  async checkLocalContent() {
    const docsLength = await localDB.collection("contents").get();
    if (docsLength.length == 1) {
      // has collection of (animals)
      return true;
    } else {
      // no collection
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

  async downloadContent(cb) {
    console.log("downloading...");
    await Promise.all([
      (async () => {
        await contentService.getAnimals(cb);
      })(),
    ]).catch((err) => console.log(err));
    console.log("done downloading!");
  }

  async updateContent(docData, docName) {
    // updating content into new base64 value

    try {
      let newContent = {
        name: docData.name,
        translatedName: docData.translatedName,
        img: await this.getBase64FromUrl(docData.img),
        audio: await this.getBase64FromUrl(docData.audio),
      };
      await this.storeDataToLocalDB(newContent, docName);
    } catch (error) {
      console.log(error);
    }
  }

  async getBase64FromUrl(url) {
    try {
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
    } catch (error) {
      console.log(error);
    }
  }

  async storeDataToLocalDB(docData, docName) {
    content.push(docData);
    let progress = store.state.status.progress;
    if (progress == content.length) {
      await localDB
        .collection("contents")
        .add(
          { [docName]: content },
          typeof docName == "string" ? docName : docName[0]
        )
        .catch((err) => console.log(err.message));
      let loading = store.state.loading;
      await loading.dismiss();
      await router.replace("/home");
    }
  }
}

let downloadContent = new DownloadContent();
export default downloadContent;
