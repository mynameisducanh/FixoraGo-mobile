import Api from "@/api/api";

class HistoryRequestServiceApi extends Api {
  constructor() {
    super("historyActiveRequest");
  }

  async createHistory() {
    return this.request("POST", "/");
  }

  async getHistory(id: string) {
    return this.request("GET", `/requestService/${id}`);
  }
}

export default HistoryRequestServiceApi;
