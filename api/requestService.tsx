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

  async getListService(id: string) {
    return this.request("GET", `/${id}`);
  }

  async getListServiceByUserId(id: string) {
    return this.request("GET", `/allbyuserid/${id}`);
  }

  async getListServiceByFixerId(id: string) {
    return this.request("GET", `/getallbyfixerid/${id}`);
  }

  async getById(id: string) {
    return this.request("GET", `/${id}`);
  }

  async getAllPendingOrRejected(params: any) {
    return this.request(
      "GET",
      `/filter?sortTime=${params.sortTime}&nameService=${params.nameService}&districts=${params.districts}&time=${params.priceRange}&isUrgent=${params.isUrgent}`
    );
  }

  async getOneByUnit(unit: string) {
    return this.request("GET", `/unit/${unit}`);
  }

  async fixerReceiveRequest(body: any) {
    return this.request("PATCH", `/fixer-approval`, body);
  }

  async getApprovedServiceByFixerId(id: string) {
    return this.request("GET", `/approved-service/${id}`);
  }

  async rejectByFixer(fixerId: string) {
    return this.request("GET", `/fixer/${fixerId}/stats`);
  }

  async rejectByUser(id: string) {
    return this.request("delete", `/${id}`);
  }

  async userCancelRequest(id: string) {
    return this.request("PATCH", `/user-cancel/${id}`);
  }

  async fixerCancelRequest(id: string) {
    return this.request("PATCH", `/fixer-reject/${id}`);
  }

  async reportRequest(payload: { requestId: string; reasons: string[]; note: string }) {
    return this.request("POST", `/report/${payload.requestId}`, {
      reasons: payload.reasons,
      note: payload.note,
    });
  }

  async updateRequest(data: any, id: string) {
    return this.request("PATCH", `/${id}`, data, {
      "Content-Type": "multipart/form-data",
    });
  }
}

export default RequestServiceApi;
