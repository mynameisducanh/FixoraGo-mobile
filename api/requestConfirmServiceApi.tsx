import { RegisterInterface, SignInInterface } from "@/types/auth";
import Api from "./api";

class RequestConfirmServiceApi extends Api {
  constructor() {
    super("requestConfirmService");
  }

  async createRequest(data: any) {
    return this.request("POST", "", data, {
      "Content-Type": "multipart/form-data",
    });
  }

  async updateRequest(data: any, id: string) {
    return this.request("PATCH", `/${id}`, data, {
      "Content-Type": "multipart/form-data",
    });
  }
  async getByRequestId(id: string, params: any) {
    return this.request("get", `/confirm/${id}?type=${params.type}`);
  }
  async userAccept(id: string) {
    return this.request("Patch", `/accept/${id}`);
  }
  async checkFixerCompleted(requestId: string) {
    return this.request("get", `/check-fixer-completed/${requestId}`);
  }
    async getRevenuaDashboash(userId: string) {
    return this.request("get", `/revenue/user/${userId}`);
  }
    async checkFixerCompleted3(requestId: string) {
    return this.request("get", `/check-fixer-completed/${requestId}`);
  }
    async checkFixerCompleted4(requestId: string) {
    return this.request("get", `/check-fixer-completed/${requestId}`);
  }
  async deleteRequest(id: string) {
    return this.request("DELETE", `/${id}`);
  }
}

export default RequestConfirmServiceApi;
