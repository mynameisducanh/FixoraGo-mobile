import Api from "@/api/api";

class SearchApi extends Api {
  constructor() {
    super("search");
  }

  async getSearchService(params:any) {
    return this.request("GET", `?query=${params.query}&type=service`);
  }
}

export default SearchApi;