import Api from "@/api/api";

class RevenueApi extends Api {
  constructor() {
    super("revenue-manager");
  }

  async getOverview(temp: string) {
    return this.request("get", `/getbytemp/${temp}`);
  }

}

export default RevenueApi;
