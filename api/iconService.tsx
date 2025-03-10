import Api from "@/api/api";

class IconServiceApi extends Api {
  constructor() {
    super("iconsService");
  }

  async getAll() {
    return this.request("GET", "/");
  }
}

export default IconServiceApi;