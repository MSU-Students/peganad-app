import { animalsQuery } from "../firestore/firebaseInit.js";
import contentService from "../services/content.service.js";
import componentUtil from "../utils/component.util.js";
import router from "../router";
import store from "../store/index.js";
import Localbase from "localbase";

let localDB = new Localbase("db");
localDB.config.debug = false;

// eslint-disable-next-line no-unused-vars
let downloadByName = false;
let content = [];
class DownloadContent {
  async checkCollection() {
    const collection = await localDB.collection("contents").get();

    if (collection.length == 1) {
      // has collection of (animals)
      // check length of animals
      const documents = await localDB.collection("contents").get();
      const collectionSize = (await animalsQuery.get()).docs.length;
      if (documents[0].length != collectionSize) {
        await localDB.collection("contents").delete();
        return false;
      } else {
        return true;
      }
    } else {
      // no collection
      await localDB.collection("contents").delete();
      return false;
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
    if (typeof url != "undefined") {
      console.log("still processing?");
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
  }

  async storeDataToLocalDB(docData, docName) {
    content.push(docData);
    let progress = store.state.status.progress;
    let collectionSize = (await animalsQuery.get()).docs.length;
    if (progress == collectionSize) {
      await localDB
        .collection("contents")
        .add(
          { [docName]: content },
          typeof docName == "string" ? docName : docName[0]
        )
        .catch((err) => console.log(err.message));
      setTimeout(async () => {
        await router.replace("/home");
      }, 1000);
    } else {
      console.log("interupt download!");
      store.commit("status", {
        progress: 0,
        payload: null, // array
        category: "",
        done: false,
      });
      await componentUtil.popupToast(
        "Network Interrupted!",
        "danger",
        3000,
        "bottom"
      );
      return;
    }
  }
}

let downloadContent = new DownloadContent();
export default downloadContent;
