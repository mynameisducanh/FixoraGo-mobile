import Api from "@/api/api";

class NotificationApi extends Api {
  constructor() {
    super("notifications");
  }

  async getAllNotification() {
    return this.request("GET", "/");
  }

  async markReadNotification(id: string) {
    return this.request("PATCH", `/${id}/read`);
  }
}

export default NotificationApi;