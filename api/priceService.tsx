import Api from "@/api/api";

class PriceServiceApi extends Api {
  constructor() {
    super("pricesService");
  }

  async getByUnit(unit: string) {
    return this.request("get", `/${unit}`);
  }

}

export default PriceServiceApi;
