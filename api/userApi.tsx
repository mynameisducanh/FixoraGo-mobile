import Api from "@/api/api";

class UserApi extends Api {
  constructor() {
    super("users");
  }

  async getByUserId(id: string) {
    return this.request("get", `/${id}`);
  }
  async getNameUserId(id: string) {
    return this.request("get", `/${id}/name`);
  }
  async updateUser(data: any, id: string) {
    return this.request("PATCH", `/profile/${id}`, data, {
      "Content-Type": "multipart/form-data",
    });
  }
}

export default UserApi;
