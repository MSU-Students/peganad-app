import {
  loadingController,
  toastController,
  createAnimation,
} from "@ionic/vue";
import { Plugins } from "@capacitor/core";
const { StatusBar } = Plugins;
class ComponentUtil {
  async popupToast(message, color, duration, position) {
    const toast = await toastController.create({
      message: message,
      color: color,
      duration: duration,
      position: position,
    });
    return toast.present();
  }

  async presentLoading(message) {
    const loading = await loadingController.create({
      message: message,
    });
    return loading;
  }

  async slideAnimation(
    element,
    speed,
    positionFrom,
    positionTo,
    opacityFrom,
    opacityTo
  ) {
    return new Promise((resolve) => {
      const animation = createAnimation()
        .addElement(document.querySelector(element))
        .duration(speed)
        .fromTo("transform", positionFrom, positionTo)
        .fromTo("opacity", opacityFrom, opacityTo);
      resolve(animation);
    });
  }

  async statusBar(color) {
    try {
      const statusBar = await StatusBar.setBackgroundColor({
        color: color,
      });
      return statusBar;
    } catch (err) {
      console.log(err.message);
    }
  }
}

let componentUtil = new ComponentUtil();
export default componentUtil;
