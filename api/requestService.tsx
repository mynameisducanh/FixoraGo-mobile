import Api from "@/api/api";
import { RequestServiceInterface } from "@/types/service";

class RequestServiceApi extends Api {
  constructor() {
    super("requestService");
  }

  async createRequestService(data: RequestServiceInterface) {
    return this.request("POST", `/`, data);
  }

  async getListService(id: number) {
    return this.request("GET", `/${id}`);
  }

  async getOneByUnit(unit: string) {
    return this.request("GET", `/unit/${unit}`);
  }
}

export default RequestServiceApi;
