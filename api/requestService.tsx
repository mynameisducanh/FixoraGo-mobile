import Api from "@/api/api";
import { RequestServiceInterface } from "@/types/service";

class RequestServiceApi extends Api {
  constructor() {
    super("requestService");
  }

  // async createRequestService(data: FormData) {
  //   return this.request("POST", `/`, data, {
  //     isFormData: "true",
  //   });
  // }

  async getListService(id: number) {
    return this.request("GET", `/${id}`);
  }

  async getListServiceByUserId(id: string) {
    return this.request("GET", `/allbyuserid/${id}`);
  }

  async getById(id: string) {
    return this.request("GET", `/${id}`);
  }

  async getOneByUnit(unit: string) {
    return this.request("GET", `/unit/${unit}`);
  }
}

export default RequestServiceApi;
