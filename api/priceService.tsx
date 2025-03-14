import Api from "@/api/api";

class PriceServiceApi extends Api {
  constructor() {
    super("pricesService");
  }

  async getByUnit(unit: string) {
    return this.request("get", `/${unit}`);
  }

  async getOneByUnit(unit: string) {
    return this.request("get", `/unit/${unit}`);
  }
}

export default PriceServiceApi;
