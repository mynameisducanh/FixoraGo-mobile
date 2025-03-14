import Api from "@/api/api";

class ListDetailServiceApi extends Api {
  constructor() {
    super("listDetailService");
  }

  async getListService(id: number) {
    return this.request("GET", `/${id}`);
  }

  async getOneByUnit(unit: string) {
    return this.request("GET", `/unit/${unit}`);
  }
}

export default ListDetailServiceApi;
