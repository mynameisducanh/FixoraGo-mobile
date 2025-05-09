import Api from "@/api/api";

class ServiceApi extends Api {
  constructor() {
    super("services");
  }

  async getId(id: string) {
    return this.request("GET", `/${id}`);
  }
}

export default ServiceApi;
