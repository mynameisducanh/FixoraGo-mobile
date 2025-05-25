import Api from "@/api/api";

class NotificationApi extends Api {
  constructor() {
    super("notifications");
  }

  async getAllNotification() {
    return this.request("GET", "/");
  }
}

export default NotificationApi;