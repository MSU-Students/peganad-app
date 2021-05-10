import { firebaseDB } from "../firestore/firebaseInit";

class NewtworkService {
  async networkStatus() {
    return new Promise((resolve) => {
      let connectedRef = firebaseDB.ref(".info/connected");
      connectedRef.on("value", async (snap) => {
        if (snap.val() == true) {
          // If Online
          resolve(true);
        } else if (snap.val() == false) {
          // Offline
          resolve(false);
        }
      });
    });
  }
}

let networkService = new NewtworkService();
export default networkService;
