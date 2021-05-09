import { loadingController, toastController } from "@ionic/vue";

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
}

let componentUtil = new ComponentUtil();
export default componentUtil;
